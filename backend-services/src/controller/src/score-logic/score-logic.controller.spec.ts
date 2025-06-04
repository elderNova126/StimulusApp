import { Test, TestingModule } from '@nestjs/testing';
import { ScoreLogicController } from './score-logic.controller';

describe('ScoreLogic Controller', () => {
  let controller: ScoreLogicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScoreLogicController],
    }).compile();

    controller = module.get<ScoreLogicController>(ScoreLogicController);
  });

  it.skip('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
