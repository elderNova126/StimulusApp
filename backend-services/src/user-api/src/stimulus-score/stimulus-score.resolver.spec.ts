import { Test, TestingModule } from '@nestjs/testing';
import { StimulusScoreResolver } from './stimulus-score.resolver';

describe('StimulusScoreResolver', () => {
  let resolver: StimulusScoreResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StimulusScoreResolver],
    }).compile();

    resolver = module.get<StimulusScoreResolver>(StimulusScoreResolver);
  });

  it.skip('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
