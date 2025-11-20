import { BadRequestException, Injectable } from '@nestjs/common';
import { SendNotificationDto } from './dto/send-notification.dto';
import * as admin from 'firebase-admin';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly userService: UsersService) {}

  async sendNotification(data: SendNotificationDto): Promise<void> {
    const user = await this.userService.findOneById(data.userId);

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    if (!user.tokenfirebase) {
      throw new BadRequestException(
        'El usuario no tiene un token de Firebase registrado.',
      );
    }

    data.tokenfirebase = user.tokenfirebase;

    const message = {
      notification: {
        title: data.title,
        body: data.body,
      },
      token: data.tokenfirebase,
    };

    try {
      await admin.messaging().send(message);
    } catch (error) {
      if (error.code === 'messaging/invalid-registration-token') {
        throw new BadRequestException(
          'El token de Firebase proporcionado es inválido.',
        );
      } else if (error.code === 'messaging/registration-token-not-registered') {
        throw new BadRequestException(
          'El token de Firebase ya no está registrado.',
        );
      } else {
        throw new BadRequestException('No se pudo enviar la notificación.');
      }
    }
  }
}
