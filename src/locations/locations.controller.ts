import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { PaginationDto } from './dto/pagination.dto';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  getAll(@Query() paginationDto: PaginationDto) {
    return this.locationsService.findAll(paginationDto);
  }

  @Get('/historyByUser')
  getHistory(
    @Query('start_date') start_date: string,
    @Query('final_date') final_date: string,
    @Query('userId') userId: string,
  ) {
    return this.locationsService.findHistory(start_date, final_date, userId);
  }

  @Post()
  create(@Body() dto: any) {
    return this.locationsService.create(dto);
  }
}
