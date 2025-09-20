import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class SendNotificationDto {
  @ApiProperty({ description: 'Token de Firebase del usuario' })
  @IsString()
  @IsOptional()
  tokenfirebase: string;

  @ApiProperty({ description: 'Id del usuario' })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ description: 'Título de la notificación' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Cuerpo de la notificación' })
  @IsString()
  @IsNotEmpty()
  body: string;
}
