import { Test, TestingModule } from '@nestjs/testing';
import { CompanyNoteController } from './company-note.controller';

describe('Note Controller', () => {
  let controller: CompanyNoteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyNoteController],
    }).compile();

    controller = module.get<CompanyNoteController>(CompanyNoteController);
  });

  it.skip('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
