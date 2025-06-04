import { Module } from '@nestjs/common';
import { ReportingResolver } from './reporting.resolver';
import { ReportingService } from './reporting.service';

@Module({
  providers: [ReportingService, ReportingResolver],
})
export class ReportingModule {}
