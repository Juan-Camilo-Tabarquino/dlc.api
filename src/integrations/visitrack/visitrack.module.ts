import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../users/user.entity';
import { VisitrackClient } from './visitrack.client';
import { VisitrackController } from './visitrack.controller';
import { VisitrackGuard } from './visitrack.guard';
import { VisitrackService } from './visitrack.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [VisitrackController],
  providers: [VisitrackClient, VisitrackGuard, VisitrackService],
})
export class VisitrackModule {}
