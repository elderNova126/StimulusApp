import { Test, TestingModule } from '@nestjs/testing';
import { ProjectCollaborationController } from './project-collaboration.controller';

describe('ProjectCollaboration Controller', () => {
  let controller: ProjectCollaborationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectCollaborationController],
    }).compile();

    controller = module.get<ProjectCollaborationController>(ProjectCollaborationController);
  });

  it.skip('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
