import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private roleRepo: Repository<Role>) {}

  findAll() {
    const res = this.roleRepo.find().then((r) => r);
    return res;
  }

  async create(createRole: CreateRoleDto) {
    try {
      const newRole = this.roleRepo.create(createRole);
      return this.roleRepo.save(newRole);
    } catch (error) {
      return {
        msg: 'Error Create New Role',
        error,
      };
    }
  }

  async clearTable() {
    await this.roleRepo.clear();
  }
}
