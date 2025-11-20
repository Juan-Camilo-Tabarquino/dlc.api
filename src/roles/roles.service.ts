import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private roleRepo: Repository<Role>) {}

  findAll() {
    return this.roleRepo.find();
  }

  async create(createRole: CreateRoleDto) {
    if (!createRole.name) {
      throw new Error('El nombre del rol es obligatorio.');
    }

    try {
      const newRole = this.roleRepo.create(createRole);
      return await this.roleRepo.save(newRole);
    } catch (error) {
      throw new Error('Error creando el rol.');
    }
  }

  async clearTable() {
    await this.roleRepo.clear();
  }
}
