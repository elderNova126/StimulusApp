import { Test, TestingModule } from '@nestjs/testing';
import { AssetController } from './asset.controller';

describe('Asset Controller', () => {
  let controller: AssetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetController],
    }).compile();

    controller = module.get<AssetController>(AssetController);
  });

  it.skip('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
