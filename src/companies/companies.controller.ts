import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Company } from './company.entity';
import { UpdateCompanyDto } from './dto/update-company.dto';

@ApiTags('Companies')
@Controller('companies')
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  @Get('/')
  getAllCompanies() {
    return this.companiesService.findAll();
  }

  @Get('/:id')
  getCompanyById(@Param('id') id: number) {
    return this.companiesService.findCompanyById(id);
  }

  @Post('createCompany')
  @ApiResponse({
    status: 201,
    description: 'La compañia fue creada exitosamente',
    type: Company,
  })
  @ApiResponse({ status: 400, description: 'Bad request', type: Company })
  @ApiResponse({
    status: 500,
    description: 'Faltan datos para crear la compañia',
    type: Company,
  })
  create(@Body() CreateCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(CreateCompanyDto);
  }

  @Put('/:id')
  updateCompany(
    @Param('id') id: number,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companiesService.updateCompany(Number(id), updateCompanyDto);
  }

  @Put('/active/:id')
  @ApiResponse({
    status: 201,
    description: 'La compañia fue actualizado exitosamente',
    type: Company,
  })
  @ApiResponse({ status: 400, description: 'Bad request', type: Company })
  updateActiveCompany(@Param('id') id: number) {
    return this.companiesService.updateActiveCompany(id);
  }

  @Delete(':id')
  deleteCompany(id: number) {
    return this.companiesService.deleteCompany(id);
  }
}
