import { Test, TestingModule } from '@nestjs/testing';
import { TENANT_CONNECTION } from 'src/database/database.constants';
import { tenantConnectionMock } from 'test/typeormConnectionMock';
import { SavedSearchService } from './saved-search.service';

describe('SavedSearchService', () => {
  let service: SavedSearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SavedSearchService,
        {
          provide: TENANT_CONNECTION,
          useValue: tenantConnectionMock,
        },
      ],
    }).compile();

    service = module.get<SavedSearchService>(SavedSearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
