import {
  BadGatewayException,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '../../users/user.entity';
import { VisitrackClient } from './visitrack.client';
import { mapCounter, mapStats, mapSurveys, mapUsers } from './visitrack.mapper';
import {
  ActivityStats,
  CounterResult,
  ProviderError,
  VisitrackSurvey,
  VisitrackUser,
} from './types/visitrack.types';

@Injectable()
export class VisitrackService {
  private readonly logger = new Logger(VisitrackService.name);
  private readonly maxRange: number;
  private readonly maxSurveys: number;
  private readonly concurrency: number;
  constructor(
    private readonly client: VisitrackClient,
    config: ConfigService,
  ) {
    this.maxRange = Number(config.get('VISITRACK_MAX_RANGE_DAYS') ?? 93);
    this.maxSurveys = Number(config.get('VISITRACK_MAX_SURVEYS') ?? 50);
    this.concurrency = Number(config.get('VISITRACK_CONCURRENCY') ?? 5);
  }

  private async context(user: User) {
    const companyId = user.company?.id;
    const companyIdVt = Number(user.company?.companyIdVt);
    if (!Number.isInteger(companyIdVt) || companyIdVt <= 0)
      throw new UnprocessableEntityException({
        code: 'VISITRACK_COMPANY_NOT_CONFIGURED',
        message: 'The company is not configured for Visitrack',
      });
    return { companyId, companyIdVt };
  }

  private validateDates(from: string, to: string) {
    const start = new Date(`${from}T00:00:00Z`);
    const end = new Date(`${to}T00:00:00Z`);
    const days = Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;
    if (!Number.isFinite(days) || days < 1 || days > this.maxRange)
      throw new UnprocessableEntityException({
        code: 'VISITRACK_INVALID_DATE_RANGE',
        message: `Date range must be inclusive and at most ${this.maxRange} days`,
      });
  }

  async surveys(user: User): Promise<VisitrackSurvey[]> {
    const ctx = await this.context(user);
    return mapSurveys(
      await this.client.get(
        '/getSurveysByCompanyId',
        { CompanyID: ctx.companyIdVt },
        ctx,
      ),
    );
  }
  async users(user: User): Promise<VisitrackUser[]> {
    const ctx = await this.context(user);
    return mapUsers(
      await this.client.get(
        '/getUsersByCompany',
        { CompanyID: ctx.companyIdVt },
        ctx,
      ),
    );
  }
  async stats(
    user: User,
    from: string,
    to: string,
    ids?: number[],
  ): Promise<ActivityStats> {
    this.validateDates(from, to);
    const ctx = await this.context(user);
    return mapStats(
      await this.client.get(
        '/getSurveysActivityStats',
        { CompanyID: ctx.companyIdVt, from, to },
        ctx,
      ),
      ids,
    );
  }
  async counters(user: User, from: string, to: string, ids?: number[]) {
    this.validateDates(from, to);
    const ctx = await this.context(user);
    const surveys = mapSurveys(
      await this.client.get(
        '/getSurveysByCompanyId',
        { CompanyID: ctx.companyIdVt },
        ctx,
      ),
    );
    const requested = ids?.length ? ids : surveys.map((s) => s.SurveyID);
    if (requested.length > this.maxSurveys)
      throw new UnprocessableEntityException({
        code: 'VISITRACK_TOO_MANY_SURVEYS',
        message: `At most ${this.maxSurveys} surveys are allowed`,
      });
    const byId = new Map(surveys.map((survey) => [survey.SurveyID, survey]));
    const data: CounterResult[] = [];
    const errors: (ProviderError & { SurveyID: number })[] = [];
    for (
      let offset = 0;
      offset < requested.length;
      offset += this.concurrency
    ) {
      const batch = requested.slice(offset, offset + this.concurrency);
      const results = await Promise.all(
        batch.map(async (SurveyID) => {
          try {
            const survey = byId.get(SurveyID) ?? { SurveyID, Title: '' };
            const raw = await this.client.get(
              '/getSurveysActivityCounter',
              { CompanyID: ctx.companyIdVt, SurveyID, from, to },
              ctx,
            );
            const result = mapCounter(raw, survey);
            if (
              result.TotalActivas + result.TotalEliminadas !==
              result.TotalActividades
            )
              this.logger.warn({
                event: 'visitrack_counter_mismatch',
                companyId: ctx.companyId,
                companyIdVt: ctx.companyIdVt,
                SurveyID,
              });
            return { result };
          } catch (error) {
            return {
              error: {
                SurveyID,
                code: 'VISITRACK_COUNTER_FAILED',
                message: (error as Error).message,
              },
            };
          }
        }),
      );
      results.forEach((entry) =>
        entry.result ? data.push(entry.result) : errors.push(entry.error),
      );
    }
    if (requested.length > 0 && data.length === 0)
      throw new BadGatewayException({
        code: 'VISITRACK_COUNTERS_TOTAL_FAILURE',
        message: 'All Visitrack counter requests failed',
        errors,
      });
    return {
      data,
      errors,
      meta: {
        requested: requested.length,
        succeeded: data.length,
        failed: errors.length,
      },
    };
  }
}
