import { Module } from '@nestjs/common';
import { StimulusScoreService } from './stimulus-score.service';
import { StimulusScoreResolver } from './stimulus-score.resolver';

@Module({
  providers: [StimulusScoreService, StimulusScoreResolver],
})
export class StimulusScoreModule {}
