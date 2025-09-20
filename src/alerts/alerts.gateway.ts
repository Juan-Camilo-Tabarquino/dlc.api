import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { AlertsService } from './alerts.service';
import { Socket } from 'socket.io';
import { forwardRef, Inject } from '@nestjs/common';

@WebSocketGateway({ cors: true })
export class AlertsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(forwardRef(() => AlertsService))
    private readonly alertsService: AlertsService,
  ) {}

  handleConnection(client: Socket) {
    const { companyId } = client.handshake.query;
    if (!companyId) client.disconnect();
    this.alertsService.registerClient(client, Number(companyId));
  }
  handleDisconnect(client: Socket) {
    this.alertsService.removeClient(client.id);
  }
}
