import { Module } from '@nestjs/common';
import { VisitrackModule } from './visitrack/visitrack.module';

@Module({ imports: [VisitrackModule] })
export class IntegrationsModule {}
