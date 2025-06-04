import { Test, TestingModule } from '@nestjs/testing';
import { SharedListController } from './shared-list.controller';

describe('SharedListController', () => {
  let controller: SharedListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SharedListController],
    }).compile();

    controller = module.get<SharedListController>(SharedListController);
  });

  it.skip('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
