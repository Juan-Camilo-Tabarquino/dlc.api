import { Module } from '@nestjs/common';
import { LastlocationsService } from './lastlocations.service';
import { LastlocationsController } from './lastlocations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LastLocation } from './lastlocation.entity';
import { LocationsModule } from 'src/locations/locations.module';
import { Alert } from 'src/alerts/alert.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LastLocation, Alert]), LocationsModule],
  providers: [LastlocationsService],
  controllers: [LastlocationsController],
  exports: [LastlocationsService],
})
export class LastlocationsModule {}
