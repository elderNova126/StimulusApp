import { Test, TestingModule } from '@nestjs/testing';
import { DataPointService } from './data-point.service';

describe('DataPointService', () => {
  let service: DataPointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataPointService],
    }).compile();

    service = module.get<DataPointService>(DataPointService);
  });

  it.skip('should be defined', () => {
    expect(service).toBeDefined();
  });
});
