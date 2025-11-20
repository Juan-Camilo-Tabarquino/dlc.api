import { Alert } from 'src/alerts/alert.entity';
import { CreateLastLocationDto } from './dto/create-lastlocation.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LastLocation } from './lastlocation.entity';
import { In, Repository } from 'typeorm';
import { UpdateLastLocationDto } from './dto/update-lastlocation.dto';

@Injectable()
export class LastlocationsService {
  constructor(
    @InjectRepository(LastLocation)
    private lastLocationsRepo: Repository<LastLocation>,
    @InjectRepository(Alert)
    private alertsRepo: Repository<Alert>,
  ) {}

  async findAll() {
    const locations = await this.lastLocationsRepo.find();

    const result = await Promise.all(
      locations.map(async (loc) => {
        const alert = await this.alertsRepo.findOne({
          where: {
            iduser: Number(loc.iduser),
            status: In([0, 1]),
          },
        });

        return {
          ...loc,
          hasAlert: !!alert,
        };
      }),
    );

    return result;
  }

  async findOne(idUser: string) {
    const lastLocation = await this.lastLocationsRepo.findOneBy({
      iduser: idUser,
    });

    if (!lastLocation) {
      throw new NotFoundException(
        `No existe lastlocation para el usuario ${idUser}`,
      );
    }

    const alert = await this.alertsRepo.findOne({
      where: {
        iduser: Number(idUser),
        status: In([0, 1]),
      },
    });

    return {
      ...lastLocation,
      hasAlert: !!alert,
    };
  }

  async create(dto: CreateLastLocationDto) {
    const serverDate = new Date().toISOString();

    const newLastLocation = this.lastLocationsRepo.create({
      serverDate,
      ...dto,
    });

    return await this.lastLocationsRepo.save(newLastLocation);
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

  async updateOrCreate(userId: string, updateData: UpdateLastLocationDto) {
    const serverDate = new Date().toISOString();

    const existing = await this.lastLocationsRepo.findOneBy({
      iduser: userId,
    });

    if (!existing) {
      const newEntry = this.lastLocationsRepo.create({
        ...updateData,
        iduser: userId,
        serverDate,
      });
      return this.lastLocationsRepo.save(newEntry);
    }

    const updated = await this.lastLocationsRepo.preload({
      id: existing.id,
      iduser: userId,
      serverDate,
      ...updateData,
    });

    return this.lastLocationsRepo.save(updated);
  }

  async clearTable() {
    await this.lastLocationsRepo.clear();
  }
}
