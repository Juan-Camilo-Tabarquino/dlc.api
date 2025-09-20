import { CompaniesModule } from 'src/companies/companies.module';
import { firebaseConfig } from 'src/config/firebase.config';
import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [UsersModule, CompaniesModule],
  providers: [NotificationsService, UsersService],
  controllers: [NotificationsController],
  exports: [NotificationsService],
})
export class NotificationsModule {
  constructor() {
    firebaseConfig();
  }
}
