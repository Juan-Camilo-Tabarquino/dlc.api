import { PartialType } from '@nestjs/mapped-types';
import { CreateLastLocationDto } from './create-lastlocation.dto';

export class UpdateLastLocationDto extends PartialType(CreateLastLocationDto) {}
