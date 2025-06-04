import { Module } from '@nestjs/common';
import { ProjectCollaborationService } from './project-collaboration.service';
import { ProjectCollaborationResolver } from './project-collaboration.resolver';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [ProjectCollaborationService, ProjectCollaborationResolver],
  exports: [ProjectCollaborationService],
})
export class ProjectCollaborationModule {}
