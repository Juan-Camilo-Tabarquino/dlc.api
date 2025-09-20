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
import { ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { isArray, map, orderBy } from 'lodash';
import { LastlocationsService } from 'src/lastlocations/lastlocations.service';
import { SaveTokenFirebaseDto } from './dto/save-token.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private readonly lastLocationService: LastlocationsService,
  ) {}

  @Get('user/withLastLocation/:companyId')
  async getUsersWithLastLocation(@Param('companyId') companyId: number) {
    try {
      const users =
        await this.usersService.findAllActivesUsersByCompany(companyId);
      const usersWithLastLocation = await Promise.all(
        isArray(users)
          ? map(users, async (user) => {
              const lastlocation = await this.lastLocationService.findOne(
                user.id.toString(),
              );
              return { ...user, lastlocation };
            })
          : null,
      );
      return usersWithLastLocation;
    } catch (error) {
      return {
        msg: 'Error Obtener Usuario con lastLocation',
        error,
      };
    }
  }

  @Get('company/:companyId')
  getAllByCompany(@Param('companyId') companyId: number) {
    return this.usersService.findAllByCompany(companyId);
  }

  @Get('/:id')
  getUserById(@Param('id') id: number) {
    return this.usersService.findOneById(id);
  }

  @Get('user/withAllLastLocation')
  async getUsersWithLastLocationAllCompanies() {
    try {
      const users = await this.getAll();
      const usersWithLastLocation = await Promise.all(
        isArray(users)
          ? map(users, async (user) => {
              const lastlocation = await this.lastLocationService.findOne(
                user.id.toString(),
              );
              return { ...user, lastlocation };
            })
          : null,
      );

      const sortedUsers = orderBy(
        usersWithLastLocation,
        [(user) => user.company?.name?.toLowerCase() || ''],
        ['asc'],
      );

      return sortedUsers;
    } catch (error) {
      return {
        msg: 'Error Obtener Usuario con lastLocation',
        error,
      };
    }
  }

  @Get()
  getAll() {
    return this.usersService.findAll();
  }

  @Post('createUser')
  @ApiResponse({
    status: 201,
    description: 'El usuario fue creado exitosamente',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad request', type: User })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('save-fbtkn')
  @ApiResponse({
    status: 201,
    description: 'Token actualizado correctamente',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad request', type: User })
  async saveTokenFirebase(@Body() tokenData: SaveTokenFirebaseDto) {
    return this.usersService.saveTokenFirebase(tokenData);
  }

  @Put('/active/:id')
  @ApiResponse({
    status: 201,
    description: 'El usuario fue actualizado exitosamente',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad request', type: User })
  updateActiveUser(@Param('id') id: number) {
    return this.usersService.updateActiveUser(id);
  }

  @Put('/:id')
  updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Put('/updatepassword/:id')
  updateUserPassword(@Param('id') id: number, @Body() Body) {
    return this.usersService.updatePassword(id, Body.newPassword);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.delete(id);
  }
}
