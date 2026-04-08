import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class SaveMobileVersionDto {
  @IsNumber()
  iduser: number;

  @IsString()
  @IsNotEmpty()
  mobileVersion: string;
}
