import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLastLocationDto {
  @IsNotEmpty()
  @IsString()
  iduser: string;

  @IsNotEmpty()
  @IsString()
  latitude: string;

  @IsNotEmpty()
  @IsString()
  longitude: string;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsOptional()
  serverDate: string;

  @IsString()
  course: string;

  @IsString()
  nomenclature: string;

  @IsString()
  speed: string;
}
