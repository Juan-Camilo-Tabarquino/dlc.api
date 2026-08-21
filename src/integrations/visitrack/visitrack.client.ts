import {
  BadGatewayException,
  GatewayTimeoutException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProviderError } from './types/visitrack.types';

@Injectable()
export class VisitrackClient {
  private readonly logger = new Logger(VisitrackClient.name);
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor(config: ConfigService) {
    const configured = config.get<string>('VISITRACK_BASE_URL');
    if (!configured && config.get('NODE_ENV') === 'production')
      throw new Error('VISITRACK_BASE_URL is required in production');
    this.baseUrl = configured ?? 'https://services.visitrack.com';
    this.timeout = Number(config.get('VISITRACK_TIMEOUT_MS') ?? 8000);
  }

  async get(
    path: string,
    query: Record<string, string | number>,
    context: { companyId: number; companyIdVt: number },
  ): Promise<unknown> {
    const url = new URL(path, this.baseUrl);
    Object.entries(query).forEach(([key, value]) =>
      url.searchParams.set(key, String(value)),
    );
    const started = Date.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);
    let status = 0;
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { accept: 'application/json' },
      });
      status = response.status;
      if (!response.ok) {
        const error: ProviderError = {
          status,
          code: 'VISITRACK_PROVIDER_ERROR',
          message: `Visitrack returned HTTP ${status}`,
        };
        throw new BadGatewayException(error);
      }
      return (await response.json()) as unknown;
    } catch (error) {
      if (error instanceof BadGatewayException) throw error;
      if ((error as Error).name === 'AbortError')
        throw new GatewayTimeoutException({
          code: 'VISITRACK_PROVIDER_TIMEOUT',
          message: 'Visitrack timed out',
        });
      throw new BadGatewayException({
        code: 'VISITRACK_PROVIDER_UNAVAILABLE',
        message: 'Visitrack is unavailable',
      });
    } finally {
      clearTimeout(timer);
      this.logger.log({
        endpoint: path,
        durationMs: Date.now() - started,
        companyId: context.companyId,
        companyIdVt: context.companyIdVt,
        status,
      });
    }
  }
}
