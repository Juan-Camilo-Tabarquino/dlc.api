import { Body, Controller, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SendNotificationDto } from './dto/send-notification.dto';
import { UsersService } from 'src/users/users.service';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly userService: UsersService,
  ) {}

  @Post('send')
  async sendNotification(@Body() body: SendNotificationDto) {
    const tokenFirebaseUser = (await this.userService.findOneById(body.userId))
      .tokenfirebase;
    body.tokenfirebase = tokenFirebaseUser;
    return this.notificationsService.sendNotification(body);
  }
}
