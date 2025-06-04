import { UploadReportModule } from './../upload-report/upload-report.module';
import { Module } from '@nestjs/common';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { LocationStreamController } from './location-stream.controller';
import { LocationStreamService } from './location-stream.service';
import { EventModule } from '../event/event.module';
import { DataTraceMetaModule } from 'src/shared/data-trace-meta/data-trace-meta.module';

@Module({
  imports: [EventModule, UploadReportModule, DataTraceMetaModule],
  controllers: [LocationController, LocationStreamController],
  providers: [LocationService, LocationStreamService],
})
export class LocationModule {}
