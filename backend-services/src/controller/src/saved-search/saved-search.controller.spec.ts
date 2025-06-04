import { Test, TestingModule } from '@nestjs/testing';
import { SavedSearchController } from './saved-search.controller';

describe('SavedSearch Controller', () => {
  let controller: SavedSearchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SavedSearchController],
    }).compile();

    controller = module.get<SavedSearchController>(SavedSearchController);
  });

  it.skip('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
