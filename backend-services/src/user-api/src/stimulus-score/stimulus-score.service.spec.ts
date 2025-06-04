import { Test, TestingModule } from '@nestjs/testing';
import { StimulusScoreService } from './stimulus-score.service';

describe('StimulusScoreService', () => {
  let service: StimulusScoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StimulusScoreService],
    }).compile();

    service = module.get<StimulusScoreService>(StimulusScoreService);
  });

  it.skip('should be defined', () => {
    expect(service).toBeDefined();
  });
});
