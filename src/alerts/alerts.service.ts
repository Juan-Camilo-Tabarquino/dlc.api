import { Alert } from './alert.entity';
import { AlertsGateway } from './alerts.gateway';
import { CreateAlertDto } from './dto/create-alert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { orderBy } from 'lodash';
import { Pool } from 'pg';
import { Repository } from 'typeorm';
import { Socket } from 'socket.io';
import { UpdateAlertStatusDto } from './dto/update-status-alert.dto';
import { UsersService } from 'src/users/users.service';
import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AlertsService implements OnModuleInit, OnModuleDestroy {
  private pgPool: Pool;
  private clientsByCompany: Map<number, Set<Socket>> = new Map();
  private clientCompanyMap: Map<string, number> = new Map();

  constructor(
    @InjectRepository(Alert) private alertsRepo: Repository<Alert>,
    private readonly userService: UsersService,
    @Inject(forwardRef(() => AlertsGateway))
    private readonly alertsGateway: AlertsGateway,
  ) {
    this.pgPool = new Pool({
      user: process.env.DB_USERNAME,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT, 10),
    });
  }

  async onModuleInit() {
    const pgClient = await this.pgPool.connect();
    await pgClient.query(`LISTEN ${process.env.DB_CHANNEL}`);

    pgClient.on('notification', async (msg) => {
      const data = JSON.parse(msg.payload);
      const user = await this.userService.findOneById(data.iduser);
      data.fullname = `${user.name} ${user.lastname}`;
      this.sendAlertToCompany(data.companyId, data);
    });
  }

  async onModuleDestroy() {
    await this.pgPool.end();
  }

  registerClient(client: Socket, companyId: number) {
    if (!this.clientsByCompany.has(companyId)) {
      this.clientsByCompany.set(companyId, new Set());
    }
    this.clientsByCompany.get(companyId).add(client);
    this.clientCompanyMap.set(client.id, companyId);
  }

  removeClient(clientId: string) {
    const companyId = this.clientCompanyMap.get(clientId);
    if (companyId !== undefined) {
      const clients = this.clientsByCompany.get(companyId);
      if (clients) {
        clients.forEach((client) => {
          if (client.id === clientId) {
            clients.delete(client);
          }
        });
        if (clients.size === 0) {
          this.clientsByCompany.delete(companyId);
        }
      }
      this.clientCompanyMap.delete(clientId);
    }
  }

  sendAlertToCompany(companyId: number, alert: Alert) {
    const clients = this.clientsByCompany.get(companyId);
    if (clients) {
      clients.forEach((client) => {
        client.emit('alert', alert);
      });
      this.updateAlertStatus(alert.id, { status: 1 });
    }
  }

  async findAlertsById(id: number) {
    try {
      const alertsByCompany = await this.alertsRepo
        .createQueryBuilder('alert')
        .leftJoin('user', 'user', 'user.id = alert.iduser')
        .select([
          'alert.*',
          "CONCAT(user.name, ' ', user.lastname) AS fullname",
        ])
        .where('alert.id = :id', { id })
        .getRawMany();

      const sortedAlertsByCompany = orderBy(
        alertsByCompany,
        [(alert) => alert.date || ''],
        ['desc'],
      );
      return sortedAlertsByCompany;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAlertsByCompanyId(companyId: number) {
    try {
      const alertsByCompany = await this.alertsRepo
        .createQueryBuilder('alert')
        .leftJoin('user', 'user', 'user.id = alert.iduser')
        .select([
          'alert.*',
          "CONCAT(user.name, ' ', user.lastname) AS fullname",
        ])
        .where('alert.companyId = :companyId', { companyId })
        .getRawMany();

      const sortedAlertsByCompany = orderBy(
        alertsByCompany,
        ['status', (alert) => alert.date || ''],
        ['asc', 'desc'],
      );
      return sortedAlertsByCompany;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findPendingAndProcessingAlerts(companyId: number) {
    try {
      const activeAlerts = await this.alertsRepo
        .createQueryBuilder('alert')
        .leftJoin('user', 'user', 'user.id = alert.iduser')
        .select([
          'alert.*',
          "CONCAT(user.name, ' ', user.lastname) AS fullname",
        ])
        .where('alert.companyId = :companyId', { companyId })
        .andWhere('alert.status IN (:...statuses)', { statuses: [0, 1] })
        .orderBy('alert.status', 'ASC')
        .addOrderBy('alert.date', 'DESC')
        .getRawMany();

      return activeAlerts;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAlertsByUserId(userId: number) {
    try {
      const alertsByUser = await this.alertsRepo.find({
        where: { iduser: userId },
      });
      const sortedAlertsByUser = orderBy(
        alertsByUser,
        [(alert) => alert.date || ''],
        ['desc'],
      );
      return sortedAlertsByUser;
    } catch (error) {
      throw new Error(error);
    }
  }

  async createAlert(createAlertDto: CreateAlertDto) {
    try {
      const serverDate = new Date().toISOString();
      const newAlert = this.alertsRepo.create({
        ...createAlertDto,
        serverDate,
      });
      return await this.alertsRepo.save(newAlert);
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateAlertStatus(id: number, newStatus: UpdateAlertStatusDto) {
    const { affected } = await this.alertsRepo.update(id, {
      status: newStatus.status,
    });

    if (affected === 0) {
      throw new NotFoundException(`Alert with id ${id} not found`);
    }

    return await this.alertsRepo.find({
      where: { id },
    });
  }
}
