import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LastLocation } from './lastlocation.entity';
import { Repository } from 'typeorm';
import { UpdateLastLocationDto } from './dto/update-lastlocation.dto';
import { CreateLastLocationDto } from './dto/create-lastlocation.dto';

@Injectable()
export class LastlocationsService {
  constructor(
    @InjectRepository(LastLocation)
    private lastLocationsRepo: Repository<LastLocation>,
  ) {}

  findALl() {
    try {
      const res = this.lastLocationsRepo.find().then((r) => r);
      return res;
    } catch (error) {
      return {
        msg: 'Error find all last locations',
        error,
      };
    }
  }

  async findOne(idUser: string) {
    try {
      const lastlocation = await this.lastLocationsRepo.findOneBy({
        iduser: idUser,
      });

      if (!lastlocation) {
        return new NotFoundException();
      }

      return lastlocation;
    } catch (error) {
      return {
        msg: 'Error find one last location',
        error,
      };
    }
  }

  async create(createLastLocationDto: CreateLastLocationDto) {
    try {
      const serverDate = new Date().toISOString();
      const newLastLocation = this.lastLocationsRepo.create({
        serverDate,
        ...createLastLocationDto,
      });

      return await this.lastLocationsRepo.save(newLastLocation);
    } catch (error) {
      return {
        msg: 'Error create lastlocation',
        error,
      };
    }
  }

  async update(id: number, userId: string, updateData: UpdateLastLocationDto) {
    try {
      const serverDate = new Date().toISOString();

      const lastlocation = await this.lastLocationsRepo.preload({
        id,
        iduser: userId,
        serverDate,
        ...updateData,
      });

      if (!lastlocation) {
        return { msg: 'No se encontró la última localización para actualizar' };
      }
      await this.lastLocationsRepo.save(lastlocation);
      return lastlocation;
    } catch (error) {
      return {
        msg: 'Error Update lastlocation service',
        error,
      };
    }
  }

  async clearTable() {
    await this.lastLocationsRepo.clear();
  }
}
