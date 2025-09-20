import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  active: boolean;

  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  nit: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  adress: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  logo?: string;
}
