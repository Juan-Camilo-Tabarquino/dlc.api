import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  cedula: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  role: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  companyId: number;
}
