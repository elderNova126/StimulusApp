import { Test, TestingModule } from '@nestjs/testing';
import { ContingencyService } from './contingency.service';

describe('ContingencyService', () => {
  let service: ContingencyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContingencyService],
    }).compile();

    service = module.get<ContingencyService>(ContingencyService);
  });

  it.skip('should be defined', () => {
    expect(service).toBeDefined();
  });
});
