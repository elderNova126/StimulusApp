import { Test, TestingModule } from '@nestjs/testing';
import { ProjectNoteResolver } from './project-note.resolver';

describe('ProjectNoteResolver', () => {
  let resolver: ProjectNoteResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectNoteResolver],
    }).compile();

    resolver = module.get<ProjectNoteResolver>(ProjectNoteResolver);
  });

  it.skip('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
