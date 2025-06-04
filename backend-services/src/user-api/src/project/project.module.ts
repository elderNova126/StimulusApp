import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectResolver } from './project.resolver';
import { AuthModule } from '../auth/auth.module';
import { ProjectCollaborationModule } from '../project-collaboration/project-collaboration.module';
import { ProjectCompanyResolver } from './project-company.resolver';

@Module({
  imports: [AuthModule, ProjectCollaborationModule],
  providers: [ProjectResolver, ProjectService, ProjectCompanyResolver],
})
export class ProjectModule {}
