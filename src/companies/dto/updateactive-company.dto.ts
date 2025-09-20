import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateActiveCompanyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  active: boolean;
}
