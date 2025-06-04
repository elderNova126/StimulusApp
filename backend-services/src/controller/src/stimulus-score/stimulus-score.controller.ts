import { Controller, UseInterceptors } from '@nestjs/common';
import { StimulusScoreService } from './stimulus-score.service';
import { Score } from './stimulus-score.entity';
import { GrpcMethod } from '@nestjs/microservices';
import { LoggingInterceptor } from '../logging/logger.interceptor';

@Controller('stimulus-score')
@UseInterceptors(LoggingInterceptor)
export class StimulusScoreController {
  constructor(private stimulusScoreService: StimulusScoreService) {}

  @GrpcMethod('DataService', 'SearchStimulusScores')
  async searchStimulusScores(data: any): Promise<{ results: Score[]; count: number }> {
    const { query, stimulusScore: filters, pagination, order } = data;
    const [results, count] = await this.stimulusScoreService.getStimulusScores(filters, query, pagination, order);

    if (count === 0) return { results: [StimulusScoreService.buildDefaultScore()], count: 1 };
    return { results, count };
  }

  @GrpcMethod('DataService', 'CreateStimulusScore')
  createstimulusScore(data: any): Promise<Score> {
    return this.stimulusScoreService.createStimulusScore(data.stimulusScore);
  }

  @GrpcMethod('DataService', 'DeleteStimulusScore')
  async deletestimulusScore(data: any): Promise<any> {
    const { id } = data;
    const res = await this.stimulusScoreService.deleteStimulusScore(id);

    return { done: res.affected > 0 };
  }

  @GrpcMethod('DataService', 'UpdateStimulusScore')
  async updatestimulusScore(data: any): Promise<Score> {
    const { id, ...stimulusScore } = data.stimulusScore;

    return this.stimulusScoreService.updateStimulusScore(id, stimulusScore);
  }
}
