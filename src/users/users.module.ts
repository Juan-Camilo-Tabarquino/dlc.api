import { CompaniesModule } from 'src/companies/companies.module';
import { LastlocationsModule } from 'src/lastlocations/lastlocations.module';
import { LastlocationsService } from 'src/lastlocations/lastlocations.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    LastlocationsModule,
    CompaniesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, LastlocationsService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
