import { Test, TestingModule } from '@nestjs/testing';
import { ContingencyController } from './contingency.controller';

describe('Contingency Controller', () => {
  let controller: ContingencyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContingencyController],
    }).compile();

    controller = module.get<ContingencyController>(ContingencyController);
  });

  it.skip('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
