import { Test, TestingModule } from '@nestjs/testing';
import { ProjectNoteController } from './project-note.controller';

describe('Note Controller', () => {
  let controller: ProjectNoteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectNoteController],
    }).compile();

    controller = module.get<ProjectNoteController>(ProjectNoteController);
  });

  it.skip('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
