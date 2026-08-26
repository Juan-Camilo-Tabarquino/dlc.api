import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { User } from '../../users/user.entity';
import {
  ActivityQueryDto,
  AnswersQueryDto,
  CountersQueryDto,
} from './dto/activity-query.dto';
import { VisitrackGuard } from './visitrack.guard';
import { VisitrackService } from './visitrack.service';

interface VisitrackRequest {
  visitrackUser: User;
}

@ApiTags('Integrations / Visitrack')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, VisitrackGuard)
@Controller('integrations/visitrack')
export class VisitrackController {
  constructor(private readonly service: VisitrackService) {}

  @Get('surveys')
  @ApiOperation({ summary: 'List the authenticated company Visitrack surveys' })
  surveys(@Request() request: VisitrackRequest) {
    return this.service.surveys(request.visitrackUser);
  }

  @Get('users')
  @ApiOperation({ summary: 'List the authenticated company Visitrack users' })
  users(@Request() request: VisitrackRequest) {
    return this.service.users(request.visitrackUser);
  }

  @Get('activity/stats')
  @ApiOperation({
    summary:
      'Activity statistics; selected percentages are recalculated over the selection',
  })
  stats(
    @Request() request: VisitrackRequest,
    @Query() query: ActivityQueryDto,
  ) {
    return this.service.stats(
      request.visitrackUser,
      query.from,
      query.to,
      query.surveyIds,
    );
  }

  @Get('activity/counters')
  @ApiOperation({
    summary:
      'Per-survey counters, with bounded concurrency and partial success metadata',
  })
  counters(
    @Request() request: VisitrackRequest,
    @Query() query: CountersQueryDto,
  ) {
    return this.service.counters(
      request.visitrackUser,
      query.from,
      query.to,
      query.surveyIds,
    );
  }

  @Get('activity/answers')
  @ApiOperation({
    summary: 'Reserved endpoint for paginated jsonAnswers (not configured)',
  })
  @ApiResponse({
    status: 501,
    description: 'External answers contract is not configured',
  })
  answers(@Query() _query: AnswersQueryDto): never {
    void _query;
    // TODO juan mora: confirmar endpoint Visitrack de actividades/jsonAnswers, autenticación, estados y paginación.
    throw new HttpException(
      {
        code: 'VISITRACK_ANSWERS_ENDPOINT_NOT_CONFIGURED',
        message: 'Visitrack answers endpoint is not configured',
      },
      HttpStatus.NOT_IMPLEMENTED,
    );
  }
}
