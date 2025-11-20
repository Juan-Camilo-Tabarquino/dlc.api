import { firebaseConfig } from 'src/config/firebase.config';
import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [NotificationsService],
  controllers: [NotificationsController],
  exports: [NotificationsService],
})
export class NotificationsModule {
  constructor() {
    firebaseConfig();
  }
}
