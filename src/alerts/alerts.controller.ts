import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiParam } from '@nestjs/swagger';

import { AlertsService } from './alerts.service';

import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertStatusDto } from './dto/update-status-alert.dto';

@ApiTags('Alerts')
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get('alertsbyid/:id')
  @ApiParam({ name: 'id', type: Number })
  async getAlertsById(@Param('id', ParseIntPipe) id: number) {
    return this.alertsService.findAlertsById(id);
  }

  @Get('alertsbycompany/:companyId')
  @ApiParam({ name: 'companyId', type: Number })
  async getAlertsByCompanyId(
    @Param('companyId', ParseIntPipe) companyId: number,
  ) {
    return this.alertsService.findAlertsByCompanyId(companyId);
  }

  @Get('activealertsbycompany/:companyId')
  @ApiParam({ name: 'companyId', type: Number })
  async getActiveAlerts(@Param('companyId', ParseIntPipe) companyId: number) {
    return this.alertsService.findPendingAndProcessingAlerts(companyId);
  }

  @Get('alertsbyuser/:userId')
  @ApiParam({ name: 'userId', type: Number })
  async getAlertsByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.alertsService.findAlertsByUserId(userId);
  }

  @Post()
  async create(@Body() createAlertDTO: CreateAlertDto) {
    return this.alertsService.createAlert(createAlertDTO);
  }

  @Put('changestatus/:id')
  @ApiParam({ name: 'id', type: Number })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAlertStatusDTO: UpdateAlertStatusDto,
  ) {
    return this.alertsService.updateAlertStatus(id, updateAlertStatusDTO);
  }
}
