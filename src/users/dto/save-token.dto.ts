import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsString } from 'class-validator';

export class SaveTokenFirebaseDto {
  @ApiProperty({
    description: 'Token de Firebase generado para las notificaciones push',
  })
  @IsString()
  @IsNotEmpty()
  tokenfirebase: string;

  @ApiProperty({
    description: 'ID del usuario asociado al token',
  })
  @IsInt()
  @IsNotEmpty()
  iduser: number;
}
