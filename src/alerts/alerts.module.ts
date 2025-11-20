import { Alert } from './alert.entity';
import { AlertsController } from './alerts.controller';
import { AlertsGateway } from './alerts.gateway';
import { AlertsService } from './alerts.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Alert]), UsersModule],
  providers: [AlertsGateway, AlertsService],
  controllers: [AlertsController],
  exports: [AlertsService],
})
export class AlertsModule {}
