import { Test, TestingModule } from '@nestjs/testing';
import { CompanyNoteResolver } from './company-note.resolver';

describe('CompanyNoteResolver', () => {
  let resolver: CompanyNoteResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyNoteResolver],
    }).compile();

    resolver = module.get<CompanyNoteResolver>(CompanyNoteResolver);
  });

  it.skip('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
