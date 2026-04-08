import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company) private companyRepo: Repository<Company>,
  ) {}

  findAll() {
    return this.companyRepo.find();
  }

  async findCompanyById(id: number) {
    try {
      const company = await this.companyRepo.findOneBy({ id });

      if (!company) {
        throw new NotFoundException(`Company with id: ${id} not found`);
      }

      return company;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async create(createCompanyDto: CreateCompanyDto) {
    if (!createCompanyDto.name || !createCompanyDto.nit) {
      throw new BadRequestException(
        'Nombre y NIT son obligatorios para crear una empresa',
      );
    }

    try {
      const serverDate = new Date().toLocaleDateString();
      const newCompany = this.companyRepo.create({
        ...createCompanyDto,
        createDate: serverDate,
        active: true,
        serverDate,
      });
      await this.companyRepo.save(newCompany);
      return newCompany;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async updateActiveCompany(id: number) {
    const company = await this.companyRepo.findOneBy({ id });

    if (!company) {
      throw new NotFoundException(`Company with id: ${id} not found`);
    }

    company.active = !company.active;

    return await this.companyRepo.save(company);
  }

  async updateCompany(id: number, updateCompanyDto: UpdateCompanyDto) {
    try {
      const { ...toUpdate } = updateCompanyDto;
      const company = await this.companyRepo.preload({ id, ...toUpdate });

      if (!company) {
        throw new NotFoundException(`Company with id: ${id} not found`);
      }

      return await this.companyRepo.save(company);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async deleteCompany(id: number) {
    const company = await this.companyRepo.findOneBy({ id });

    if (!company) {
      throw new NotFoundException(`Company with id: ${id} not found`);
    }

    await this.companyRepo.remove(company);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    // this.logger.error(error)

    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
