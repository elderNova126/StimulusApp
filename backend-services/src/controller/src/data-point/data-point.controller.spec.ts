import { Test, TestingModule } from '@nestjs/testing';
import { DataPointController } from './data-point.controller';

describe('DataPoint Controller', () => {
  let controller: DataPointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataPointController],
    }).compile();

    controller = module.get<DataPointController>(DataPointController);
  });

  it.skip('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
