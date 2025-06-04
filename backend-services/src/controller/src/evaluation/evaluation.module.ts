import { forwardRef, Module } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { EvaluationController } from './evaluation.controller';
import { EventModule } from '../event/event.module';
import { SCORE_QUEUE } from '../score-logic/score-job.constants';
import { BullModule } from '@nestjs/bull';
import { TenantCompanyRelationshipModule } from '../tenant-company-relationship/tenant-company-relationship.module';
import { ScoreLogicModule } from '../score-logic/score-logic.module';
import { GlobalProjectModule } from '../project-tree/project-tree.module';
import { SupplierTierModule } from '../supplier-tier/supplier-tier.module';

@Module({
  imports: [
    GlobalProjectModule,
    SupplierTierModule,
    forwardRef(() => ScoreLogicModule),
    EventModule,
    TenantCompanyRelationshipModule,
    BullModule.registerQueue({
      name: SCORE_QUEUE,
    }),
  ],
  providers: [EvaluationService],
  exports: [EvaluationService],
  controllers: [EvaluationController],
})
export class EvaluationModule {}
