import { Module } from '@nestjs/common';
import { DataTraceMetaService } from './data-trace-meta.service';

@Module({
  controllers: [],
  providers: [DataTraceMetaService],
  exports: [DataTraceMetaService],
})
export class DataTraceMetaModule {}
