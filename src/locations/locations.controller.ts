import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { LocationsService } from './locations.service';

@Controller('locations')
export class LocationsController {
  constructor(private LocationsService: LocationsService) {}

  @Get()
  getAll() {
    try {
      return this.LocationsService.findALl();
    } catch (error) {
      return {
        msg: 'Error get all locations',
        error,
      };
    }
  }

  @Get('/historyByUser')
  getHistory(
    @Query('start_date') start_date: string,
    @Query('final_date') final_date: string,
    @Query('userId') userId: string,
  ) {
    try {
      return this.LocationsService.findHistory(start_date, final_date, userId);
    } catch (error) {
      return {
        msg: 'Error get history location',
        error,
      };
    }
  }

  @Post()
  create(@Body() createLocation: any) {
    try {
      return this.LocationsService.create(createLocation);
    } catch (error) {
      // TODO: Manejar errores
      return {
        msg: 'Error create location',
        error,
      };
    }
  }
}
