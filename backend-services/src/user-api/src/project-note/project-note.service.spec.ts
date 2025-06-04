import { Test, TestingModule } from '@nestjs/testing';
import { ProjectNoteService } from './project-note.service';

describe('NoteService', () => {
  let service: ProjectNoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectNoteService],
    }).compile();

    service = module.get<ProjectNoteService>(ProjectNoteService);
  });

  it.skip('should be defined', () => {
    expect(service).toBeDefined();
  });
});
