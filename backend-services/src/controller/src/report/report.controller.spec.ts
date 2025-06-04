import { Test, TestingModule } from '@nestjs/testing';
import { ReportController } from './report.controller';

describe('ReportController', () => {
  let controller: ReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportController],
    }).compile();

    controller = module.get<ReportController>(ReportController);
  });

  it.skip('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
