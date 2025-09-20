import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { LastlocationsService } from './lastlocations.service';
import { UpdateLastLocationDto } from './dto/update-lastlocation.dto';
import { LastLocation } from './lastlocation.entity';
import { LocationsService } from 'src/locations/locations.service';
import { CreateLocationDto } from 'src/locations/dto/create-location.dto';

@Controller('lastlocations')
export class LastlocationsController {
  constructor(
    private lastLocationService: LastlocationsService,
    private locationService: LocationsService,
  ) {}

  @Get()
  findAll() {
    return this.lastLocationService.findALl();
  }
  @Get(':id')
  async findLastLocationByUserId(@Param('id') userId: string) {
    try {
      if (userId === undefined)
        return { msg: 'Por favor envie un userId para realizar la consulta' };

      const lastLocation = await this.lastLocationService.findOne(userId);
      return lastLocation;
    } catch (error) {
      return {
        msg: 'Error find one lastlocation',
        error,
      };
    }
  }

  @Post()
  create(@Body() lastL: any) {
    try {
      return this.lastLocationService.create(lastL);
    } catch (error) {
      return {
        msg: 'Error create LastLocation',
        error,
      };
    }
  }

  @Put(':id')
  async updateLastLocation(
    @Param('id') userId: string,
    @Body() updateLastLocationData: UpdateLastLocationDto,
  ) {
    try {
      const lastLocation = await this.lastLocationService.findOne(userId);

      await this.locationService.create(
        updateLastLocationData as CreateLocationDto,
      );

      if (
        lastLocation instanceof NotFoundException &&
        lastLocation.getStatus() === 404
      ) {
        return await this.lastLocationService.create(
          updateLastLocationData as LastLocation,
        );
      }

      const id = (lastLocation as LastLocation).id;
      return await this.lastLocationService.update(
        id,
        userId,
        updateLastLocationData,
      );
    } catch (error) {
      return {
        msg: 'Error update LastLocation controller',
        error,
      };
    }
  }

  @Delete()
  async deleteAll() {
    await this.lastLocationService.clearTable();
  }
}
