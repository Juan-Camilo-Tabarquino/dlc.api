import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  getAll() {
    return this.rolesService.findAll();
  }

  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  @Delete()
  clearTable() {
    return this.rolesService.clearTable();
  }
}
