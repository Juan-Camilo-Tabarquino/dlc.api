import { Module } from '@nestjs/common';
import { LastlocationsService } from './lastlocations.service';
import { LastlocationsController } from './lastlocations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LastLocation } from './lastlocation.entity';
import { LocationsModule } from 'src/locations/locations.module';

@Module({
  imports: [TypeOrmModule.forFeature([LastLocation]), LocationsModule],
  providers: [LastlocationsService],
  controllers: [LastlocationsController],
  exports: [TypeOrmModule],
})
export class LastlocationsModule {}
