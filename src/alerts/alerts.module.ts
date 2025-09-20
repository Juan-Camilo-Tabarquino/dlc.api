import { Alert } from './alert.entity';
import { AlertsController } from './alerts.controller';
import { AlertsGateway } from './alerts.gateway';
import { AlertsService } from './alerts.service';
import { CompaniesModule } from 'src/companies/companies.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Alert]),
    forwardRef(() => AlertsModule),
    UsersModule,
    CompaniesModule,
  ],
  providers: [AlertsGateway, AlertsService, UsersService],
  controllers: [AlertsController],
  exports: [AlertsService],
})
export class AlertsModule {}
