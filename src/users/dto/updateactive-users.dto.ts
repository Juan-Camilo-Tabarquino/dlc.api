import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateActiveUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  active: boolean;
}
