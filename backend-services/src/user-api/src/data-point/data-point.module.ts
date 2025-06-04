import { Module } from '@nestjs/common';
import { DataPointService } from './data-point.service';
import { DataPointResolver } from './data-point.resolver';

@Module({
  providers: [DataPointService, DataPointResolver],
})
export class DataPointModule {}
