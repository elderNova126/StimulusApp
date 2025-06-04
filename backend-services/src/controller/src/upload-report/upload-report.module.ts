import { Module } from '@nestjs/common';
import { UploadReportService } from './upload-report.service';
import { UploadReportController } from './upload-report.controller';

@Module({
  imports: [],
  providers: [UploadReportService],
  controllers: [UploadReportController],
  exports: [UploadReportService],
})
export class UploadReportModule {}
