import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UsersService } from 'src/users/users.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UpdateAlertStatusDto } from './dto/update-status-alert.dto';

@Controller('alerts')
export class AlertsController {
  constructor(
    private alertsService: AlertsService,
    private readonly userService: UsersService,
  ) {}

  @Get('alertsbyid/:id')
  async getAlertsById(@Param('id') id: string) {
    const parsedId = Number(id);

    if (!parsedId || isNaN(parsedId)) {
      throw new BadRequestException(
        'El parámetro id debe ser un número válido',
      );
    }
    return this.alertsService.findAlertsById(parsedId);
  }

  @Get('alertsbycompany/:companyId')
  async getAlertsByCompanyId(@Param('companyId') companyId: string) {
    const parsedCompanyId = Number(companyId);

    if (!parsedCompanyId || isNaN(parsedCompanyId)) {
      throw new BadRequestException(
        'El parámetro companyId debe ser un número válido',
      );
    }
    return this.alertsService.findAlertsByCompanyId(parsedCompanyId);
  }

  @Get('activealertsbycompany/:companyId')
  async getActiveAlerts(@Param('companyId') companyId: string) {
    const parsedCompanyId = Number(companyId);

    if (!parsedCompanyId || isNaN(parsedCompanyId)) {
      throw new BadRequestException(
        'El parámetro companyId debe ser un número válido',
      );
    }
    return this.alertsService.findPendingAndProcessingAlerts(parsedCompanyId);
  }

  @Get('alertsbyuser/:userId')
  async getAlertsByUserId(@Param('userId') userId: string) {
    const parsedUserId = Number(userId);

    if (!parsedUserId || isNaN(parsedUserId)) {
      throw new BadRequestException(
        'El parámetro userId debe ser un número válido',
      );
    }
    return this.alertsService.findAlertsByUserId(parsedUserId);
  }

  @Post()
  async create(@Body() createAlertDTO: CreateAlertDto) {
    createAlertDTO.companyId = (
      await this.userService.findOneById(createAlertDTO.iduser)
    ).company.id;
    return this.alertsService.createAlert(createAlertDTO);
  }

  @Put('changestatus/:id')
  async updateActive(
    @Param('id') id: number,
    @Body() updateAlertStatudDTO: UpdateAlertStatusDto,
  ) {
    const parsedAlertId = Number(id);

    if (!parsedAlertId || isNaN(parsedAlertId)) {
      throw new BadRequestException(
        'El parámetro id de la alerta debe ser un número válido',
      );
    }
    return this.alertsService.updateAlertStatus(
      parsedAlertId,
      updateAlertStatudDTO,
    );
  }
}
