import { Test, TestingModule } from '@nestjs/testing';
import { DataTraceMetaService } from './data-trace-meta.service';

describe('DataTraceMetaService', () => {
  let service: DataTraceMetaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataTraceMetaService],
    }).compile();

    service = module.get<DataTraceMetaService>(DataTraceMetaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
