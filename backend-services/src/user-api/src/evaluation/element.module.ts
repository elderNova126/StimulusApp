import { Module } from '@nestjs/common';
import { EvaluationResolver } from './evaluation.resolver';
import { EvaluationService } from './evaluation.service';

@Module({
  providers: [EvaluationResolver, EvaluationService],
})
export class EvaluationModule {}
