import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from './location.entity';
import { Between, Repository } from 'typeorm';
import { CreateLocationDto } from './dto/create-location.dto';
import { reduce } from 'lodash';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location) private locationsRepo: Repository<Location>,
  ) {}

  async findAll({ page = 1, limit = 20 }: PaginationDto) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.locationsRepo.findAndCount({
      skip,
      take: limit,
      order: { date: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findHistory(start_date: string, final_date: string, userId: string) {
    const res = await this.locationsRepo.find({
      where: { date: Between(start_date, final_date), iduser: userId },
      order: { date: 'ASC' },
    });

    const locationsByDate = reduce(
      res,
      (acc, location) => {
        const dateKey = new Date(location.date).toISOString().split('T')[0];

        let dateEntry = acc.find((entry) => entry.date === dateKey);
        if (!dateEntry) {
          dateEntry = { date: dateKey, route: [] };
          acc.push(dateEntry);
        }

        dateEntry.route.push({
          iduser: location.iduser,
          time: new Date(location.date)
            .toISOString()
            .split('T')[1]
            .split('.')[0],
          coordinates: [Number(location.longitude), Number(location.latitude)],
          course: location.course,
        });

        return acc;
      },
      [] as {
        date: string;
        route: Partial<Location & { time: string; coordinates: number[] }>[];
      }[],
    );

    return locationsByDate;
  }

  async create(createLocationDto: CreateLocationDto) {
    const serverDate = new Date().toISOString();

    const newLocation = this.locationsRepo.create({
      ...createLocationDto,
      serverDate,
    });

    return this.locationsRepo.save(newLocation);
  }
}
