import { UploadReportModule } from './../upload-report/upload-report.module';
import { Module } from '@nestjs/common';
import { ContingencyService } from './contingency.service';
import { ContingencyController } from './contingency.controller';
import { ContingencyStreamService } from './contingency-stream.service';
import { ContingencyStreamController } from './contingency-stream.controller';
import { EventModule } from '../event/event.module';

@Module({
  imports: [EventModule, UploadReportModule],
  providers: [ContingencyService, ContingencyStreamService],
  controllers: [ContingencyController, ContingencyStreamController],
})
export class ContingencyModule {}
