import { Test, TestingModule } from '@nestjs/testing';
import { ProjectCollaborationResolver } from './project-collaboration.resolver';

describe('ProjectCollaborationResolver', () => {
  let resolver: ProjectCollaborationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectCollaborationResolver],
    }).compile();

    resolver = module.get<ProjectCollaborationResolver>(ProjectCollaborationResolver);
  });

  it.skip('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
