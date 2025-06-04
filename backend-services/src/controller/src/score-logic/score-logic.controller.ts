import { Controller, UseInterceptors, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { InjectQueue } from '@nestjs/bull';
import { SCORE_QUEUE, SCORE_ON_DEMAND_JOB } from './score-job.constants';
import { Queue } from 'bull';
import { LoggingInterceptor } from '../logging/logger.interceptor';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { StimulusJobData } from '../scheduler/stimulus-job-data.interface';
import { Repository, Connection } from 'typeorm';
import { GLOBAL_CONNECTION } from '../database/database.constants';
import { Company } from '../company/company.entity';

@Controller('score-logic')
@UseInterceptors(LoggingInterceptor)
export class ScoreLogicController {
  private readonly companyRepository: Repository<Company>;
  constructor(
    @InjectQueue(SCORE_QUEUE) private scoreQueue: Queue<StimulusJobData<any>>,
    @Inject(GLOBAL_CONNECTION) globalConnection: Connection,
    private readonly moduleRef: ModuleRef
  ) {
    this.companyRepository = globalConnection.getRepository(Company);
  }

  @GrpcMethod('DataService', 'CalculateStimulusScore')
  async calculateStimulusScore(data: any) {
    const companyId = data.companyId;
    const contextId = ContextIdFactory.create();
    const logger = await this.moduleRef.resolve(StimulusLogger, contextId, { strict: false });
    logger.context = ScoreLogicController.name;
    const companies = companyId
      ? [companyId]
      : (await this.companyRepository.createQueryBuilder('company').select('id').getRawMany()).map(({ id }) => id);
    const job = await this.scoreQueue.add(SCORE_ON_DEMAND_JOB, {
      data: {
        companies,
      },
    });
    logger.log(JSON.stringify(job));

    return { success: true };
  }
}
