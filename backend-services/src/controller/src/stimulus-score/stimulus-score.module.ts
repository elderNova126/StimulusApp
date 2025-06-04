import { Module } from '@nestjs/common';
import { StimulusScoreController } from './stimulus-score.controller';
import { StimulusScoreService } from './stimulus-score.service';

@Module({
  controllers: [StimulusScoreController],
  providers: [StimulusScoreService],
})
export class StimulusScoreModule {}
