import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private RolesService: RolesService) {}

  @Get()
  getAll() {
    try {
      return this.RolesService.findAll();
    } catch (error) {
      return {
        msg: 'Error Get All Roles',
        error,
      };
    }
  }

  @Post()
  create(@Body() createNewRole: CreateRoleDto) {
    try {
      return this.RolesService.create(createNewRole);
    } catch (error) {
      return {
        msg: 'Error Create Role',
        error,
      };
    }
  }

  @Delete()
  clearTable() {
    return this.RolesService.clearTable();
  }
}
