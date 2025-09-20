import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateLocationDto {
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
  @IsDate()
  date: string;

  @IsString()
  course: string;

  @IsString()
  nomenclature: string;

  @IsString()
  speed: string;
}
