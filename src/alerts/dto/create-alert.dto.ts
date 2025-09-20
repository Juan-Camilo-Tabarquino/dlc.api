import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAlertDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  iduser: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  companyId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  latitude: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  longitude: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  status: number;
}
