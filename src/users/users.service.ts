import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Company } from 'src/companies/company.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { omit } from 'lodash';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { SaveTokenFirebaseDto } from './dto/save-token.dto';

dotenv.config();

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
  ) {}

  findAll() {
    return this.usersRepo.find({
      where: { role: Not(1) },
      relations: ['company'],
    });
  }

  findAllByCompany(companyId: number) {
    try {
      const res = this.usersRepo
        .find({
          where: { company: { id: companyId }, role: 3 },
          relations: ['company'],
        })
        .then((r) => r);
      return res;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAllActivesUsersByCompany(companyId: number) {
    try {
      const res = this.usersRepo
        .find({
          where: { company: { id: companyId }, role: 3, active: true },
          relations: ['company'],
        })
        .then((r) => r);
      return res;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(username: string) {
    try {
      return await this.usersRepo
        .findOne({ where: { username }, relations: ['company'] })
        .then((r) => r);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOneById(id: number) {
    try {
      const user = await this.usersRepo.findOne({
        where: { id },
        relations: ['company'],
      });
      return omit(user, ['password']);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, username, cedula, companyId, ...userDetails } =
        createUserDto;

      const user = await this.usersRepo.find({
        where: [{ cedula: cedula }, { username: username }],
      });

      if (user.length > 0)
        throw new ConflictException(
          `El usuario con cedula ${cedula} o con username ${username} ya se encuentra registrado`,
        );

      const saltRounds = Number(process.env.SALT_ROUNDS);
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const serverDate = new Date().toLocaleDateString();

      const company = await this.companyRepo.findOneBy({
        id: Number(companyId),
      });

      if (company) {
        const newUser = this.usersRepo.create({
          ...userDetails,
          username,
          password: hashedPassword,
          createDate: serverDate,
          serverDate,
          company,
          cedula,
        });

        return await this.usersRepo.save(newUser);
      } else {
        return new NotFoundException(
          `No se encontro la compania con el id ${companyId}`,
        );
      }
    } catch (error) {
      throw error;
    }
  }

  async saveTokenFirebase(dataToken: SaveTokenFirebaseDto) {
    try {
      const user = await this.usersRepo.findOneBy({ id: dataToken.iduser });
      if (!user)
        throw new NotFoundException(
          `Not user found with id ${dataToken.iduser}`,
        );
      user.tokenfirebase = dataToken.tokenfirebase;
      await this.usersRepo.save(user);
      return { message: 'Token actualizado correctamente' };
    } catch (error) {
      throw error;
    }
  }

  async updateActiveUser(id: number) {
    const user = await this.usersRepo.findOneBy({ id });

    if (!user) throw new NotFoundException(`Not user found with id ${id}`);

    user.active = !user.active;

    return await this.usersRepo.save(user);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const { ...toUpdate } = updateUserDto;

    const user = await this.usersRepo.preload({ id, ...toUpdate });

    if (!user) {
      throw new NotFoundException(`User with id: ${id} not found`);
    }

    return await this.usersRepo.save(user);
  }

  async updatePassword(id: number, newPassword: string) {
    const user = await this.usersRepo.findOneBy({ id });

    if (!user) throw new NotFoundException(`Not user found with id ${id}`);

    const saltRounds = Number(process.env.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password = hashedPassword;

    return await this.usersRepo.save(user);
  }

  async delete(id: number) {
    const result = await this.usersRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Usuario con el ID ${id} no encontrado`);
    }
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    // this.logger.error(error)

    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
      error,
    );
  }
}
