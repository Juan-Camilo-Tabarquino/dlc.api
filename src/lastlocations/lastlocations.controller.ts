import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { LastlocationsService } from './lastlocations.service';
import { UpdateLastLocationDto } from './dto/update-lastlocation.dto';
import { LocationsService } from 'src/locations/locations.service';
import { CreateLocationDto } from 'src/locations/dto/create-location.dto';
import { CreateLastLocationDto } from './dto/create-lastlocation.dto';

@Controller('lastlocations')
export class LastlocationsController {
  constructor(
    private readonly lastLocationService: LastlocationsService,
    private readonly locationService: LocationsService,
  ) {}

  @Get()
  findAll() {
    return this.lastLocationService.findAll();
  }

  @Get(':id')
  findLastLocationByUserId(@Param('id', ParseIntPipe) userId: string) {
    return this.lastLocationService.findOne(userId);
  }

  @Post()
  create(@Body() dto: CreateLastLocationDto) {
    return this.lastLocationService.create(dto);
  }

  @Put(':id')
  async updateLastLocation(
    @Param('id', ParseIntPipe) userId: string,
    @Body() dto: UpdateLastLocationDto,
  ) {
    await this.locationService.create(dto as CreateLocationDto);
    return this.lastLocationService.updateOrCreate(userId, dto);
  }

  @Delete()
  deleteAll() {
    return this.lastLocationService.clearTable();
  }
}
