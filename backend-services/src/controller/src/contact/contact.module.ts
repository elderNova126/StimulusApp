import { Module } from '@nestjs/common';
import { CacheForRedisModule } from 'src/cache-for-redis/cache-redis.module';
import { DataTraceMetaModule } from 'src/shared/data-trace-meta/data-trace-meta.module';
import { EventModule } from '../event/event.module';
import { UploadReportModule } from './../upload-report/upload-report.module';
import { ContactStreamController } from './contact-stream.controller';
import { ContactStreamService } from './contact-stream.service';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';

@Module({
  imports: [EventModule, UploadReportModule, DataTraceMetaModule, CacheForRedisModule],
  controllers: [ContactController, ContactStreamController],
  providers: [ContactService, ContactStreamService],
})
export class ContactModule {}
