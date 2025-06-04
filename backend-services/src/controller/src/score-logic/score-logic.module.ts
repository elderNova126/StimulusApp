import { forwardRef, Module, OnApplicationBootstrap } from '@nestjs/common';
import { CalculationStrategyService } from './score-calculation.strategy.service';
import { ConfigModule } from '@nestjs/config';
import { ScoreLogicServiceV2 } from './score-logic.service.v2';
import { EvaluationModule } from '../evaluation/evaluation.module';
import { CALCULATE_SCORE_JOB, SCORE_QUEUE } from './score-job.constants';
import { BullModule, InjectQueue } from '@nestjs/bull';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { StimulusJobData } from '../scheduler/stimulus-job-data.interface';
import { Queue } from 'bull';
import { ScoreLogicProcessorService } from './score-logic-processor.service';
import { ScoreLogicController } from './score-logic.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: SCORE_QUEUE,
    }),
    ConfigModule,
    ConfigModule.forRoot(),
    forwardRef(() => EvaluationModule),
  ],
  providers: [CalculationStrategyService, ScoreLogicServiceV2, ScoreLogicProcessorService],
  controllers: [ScoreLogicController],
  exports: [ScoreLogicServiceV2],
})
export class ScoreLogicModule implements OnApplicationBootstrap {
  constructor(
    @InjectQueue(SCORE_QUEUE) private scoreQueue: Queue<StimulusJobData<any>>,
    private readonly moduleRef: ModuleRef
  ) {}

  async onApplicationBootstrap() {
    const contextId = ContextIdFactory.create();
    const logger = await this.moduleRef.resolve(StimulusLogger, contextId, { strict: false });
    logger.context = ScoreLogicModule.name;
    const job = await this.scoreQueue.add(
      CALCULATE_SCORE_JOB,
      {},
      {
        repeat: { cron: '45 22 18 * *' },
      }
    );
    logger.log(JSON.stringify(job));
  }
}
