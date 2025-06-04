import { Test, TestingModule } from '@nestjs/testing';
import { StimulusScoreController } from './stimulus-score.controller';

describe('StimulusScore Controller', () => {
  let controller: StimulusScoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StimulusScoreController],
    }).compile();

    controller = module.get<StimulusScoreController>(StimulusScoreController);
  });

  it.skip('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
