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
import { SaveTokenFirebaseDto } from './dto/save-token.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { SaveMobileVersionDto } from './dto/save-mobile-version.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('user/withAllLastLocation')
  getUsersWithLastLocationAllCompanies() {
    return this.usersService.getUsersWithLastLocationAllCompanies();
  }

  @Get('user/withLastLocation/:companyId')
  getUsersWithLastLocation(
    @Param('companyId', ParseIntPipe) companyId: number,
  ) {
    return this.usersService.getUsersWithLastLocation(companyId);
  }

  @Get('company/:companyId')
  getAllByCompany(@Param('companyId', ParseIntPipe) companyId: number) {
    return this.usersService.findAllByCompany(companyId);
  }

  @Get('/:id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOneById(id);
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
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('save-fbtkn')
  @ApiResponse({
    status: 201,
    description: 'Token actualizado correctamente',
    type: User,
  })
  async saveTokenFirebase(@Body() tokenData: SaveTokenFirebaseDto) {
    return this.usersService.saveTokenFirebase(tokenData);
  }

  @Post('save-mobile-version')
  async saveMobileVersion(@Body() data: SaveMobileVersionDto) {
    return this.usersService.saveMobileVersion(data);
  }

  @Put('/active/:id')
  updateActiveUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.updateActiveUser(id);
  }

  @Put('/:id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Put('/updatepassword/:id')
  updateUserPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body('newPassword') newPassword: string,
  ) {
    return this.usersService.updatePassword(id, newPassword);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.delete(id);
  }
}
