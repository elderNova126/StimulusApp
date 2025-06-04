import { Test, TestingModule } from '@nestjs/testing';
import { SavedSearchService } from './saved-search.service';

describe('SavedSearchService', () => {
  let service: SavedSearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SavedSearchService],
    }).compile();

    service = module.get<SavedSearchService>(SavedSearchService);
  });

  it.skip('should be defined', () => {
    expect(service).toBeDefined();
  });
});
