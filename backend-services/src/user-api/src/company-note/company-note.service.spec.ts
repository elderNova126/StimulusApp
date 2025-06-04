import { Test, TestingModule } from '@nestjs/testing';
import { CompanyNoteService } from './company-note.service';

describe('CompanyNoteService', () => {
  let service: CompanyNoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyNoteService],
    }).compile();

    service = module.get<CompanyNoteService>(CompanyNoteService);
  });

  it.skip('should be defined', () => {
    expect(service).toBeDefined();
  });
});
