import { UploadReportModule } from './../upload-report/upload-report.module';
import { Module } from '@nestjs/common';
import { InsuranceService } from './insurance.service';
import { InsuranceController } from './insurance.controller';
import { InsuranceStreamService } from './insurance-stream.service';
import { InsuranceStreamController } from './insurance-stream.controller';
import { EventModule } from '../event/event.module';

@Module({
  imports: [EventModule, UploadReportModule],
  providers: [InsuranceService, InsuranceStreamService],
  controllers: [InsuranceController, InsuranceStreamController],
})
export class InsuranceModule {}
