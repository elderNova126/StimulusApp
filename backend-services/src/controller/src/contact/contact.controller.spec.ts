import { Test, TestingModule } from '@nestjs/testing';
import { ContactController } from './contact.controller';

describe('Contact Controller', () => {
  let controller: ContactController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactController],
    }).compile();

    controller = module.get<ContactController>(ContactController);
  });

  it.skip('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
