import { Test, TestingModule } from '@nestjs/testing';
import { InsuranceController } from './insurance.controller';

describe('Insurance Controller', () => {
  let controller: InsuranceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InsuranceController],
    }).compile();

    controller = module.get<InsuranceController>(InsuranceController);
  });

  it.skip('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
