import { AlertsModule } from './alerts/alerts.module';
import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { ConfigModule } from '@nestjs/config';
import { LastlocationsModule } from './lastlocations/lastlocations.module';
import { LocationsModule } from './locations/locations.module';
import { Module } from '@nestjs/common';
import { RolesModule } from './roles/roles.module';
import { typeOrmDBConfig } from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AlertsModule,
    AuthModule,
    CompaniesModule,
    LastlocationsModule,
    LocationsModule,
    NotificationsModule,
    RolesModule,
    TypeOrmModule.forRoot(typeOrmDBConfig),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
