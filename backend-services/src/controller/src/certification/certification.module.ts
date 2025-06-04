import { UploadReportModule } from './../upload-report/upload-report.module';
import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { CertificationController } from './certification.controller';
import { CertificationService } from './certification.service';
import { CertificationStreamController } from './certification-stream.controller';
import { CertificationStreamService } from './certification-stream.service';
import { BullModule, InjectQueue } from '@nestjs/bull';
import { CERTIFICATION_QUEUE, EXPIRED_CERTIFICATION_JOB } from './certification-job.constants';
import { Queue } from 'bull';
import { StimulusJobData } from '../scheduler/stimulus-job-data.interface';
import { CertificationProcessorService } from './certification-processor.service';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { EventModule } from '../event/event.module';

import { DataTraceMetaModule } from 'src/shared/data-trace-meta/data-trace-meta.module';

@Module({
  imports: [
    EventModule,
    UploadReportModule,
    BullModule.registerQueue({
      name: CERTIFICATION_QUEUE,
    }),
    DataTraceMetaModule,
  ],
  controllers: [CertificationController, CertificationStreamController],
  providers: [CertificationService, CertificationStreamService, CertificationProcessorService],
})
export class CertificationModule implements OnApplicationBootstrap {
  constructor(
    @InjectQueue(CERTIFICATION_QUEUE) private certificationQueue: Queue<StimulusJobData<any>>,
    private readonly moduleRef: ModuleRef
  ) {}

  async onApplicationBootstrap() {
    const contextId = ContextIdFactory.create();
    const logger = await this.moduleRef.resolve(StimulusLogger, contextId, { strict: false });
    logger.context = CertificationModule.name;
    const job = await this.certificationQueue.add(
      EXPIRED_CERTIFICATION_JOB,
      {},
      {
        repeat: { cron: '0 1 * * *' },
      }
    );
    logger.log(JSON.stringify(job));
  }
}
