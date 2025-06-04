import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { StimulusJobData } from '../scheduler/stimulus-job-data.interface';
import { CERTIFICATION_QUEUE, EXPIRED_CERTIFICATION_JOB } from './certification-job.constants';

@Injectable()
@Processor(CERTIFICATION_QUEUE)
export class CertificationProcessorService {
  constructor(private readonly logger: StimulusLogger) {
    this.logger.context = CertificationProcessorService.name;
  }

  @Process(EXPIRED_CERTIFICATION_JOB)
  async repeat(_job: Job<StimulusJobData<any>>) {
    // TODO Add proper implementation
    // this.logger.log(JSON.stringify(job.data));
  }
}
