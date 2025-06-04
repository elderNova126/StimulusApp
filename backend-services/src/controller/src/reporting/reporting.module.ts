import { Module } from '@nestjs/common';
import { ReportingEmbeddingAuthService } from './report-embedding-auth.service';
import { ReportingEmbeddingConfigService } from './report-embedding-config.service';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

@Module({
  controllers: [ReportController],
  providers: [ReportService, ReportingEmbeddingAuthService, ReportingEmbeddingConfigService],
})
export class ReportingModule {}
