import { Test, TestingModule } from '@nestjs/testing';
import { AttachmentController } from './attachment.controller';

describe('Attachment Controller', () => {
  let controller: AttachmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttachmentController],
    }).compile();

    controller = module.get<AttachmentController>(AttachmentController);
  });

  it.skip('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
