import { LastlocationsModule } from 'src/lastlocations/lastlocations.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Company } from 'src/companies/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Company]), LastlocationsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
