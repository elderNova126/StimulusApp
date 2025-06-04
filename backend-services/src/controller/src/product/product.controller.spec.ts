import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';

describe('Product Controller', () => {
  let controller: ProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
    }).compile();

    controller = await module.resolve<ProductController>(ProductController);
  });

  it.skip('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
