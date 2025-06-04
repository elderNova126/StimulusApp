import { Module } from '@nestjs/common';
import { ProjectCollaborationService } from './project-collaboration.service';
import { ProjectCollaborationController } from './project-collaboration.controller';
import { UserProfileModule } from '../user-profile/user-profile.module';
import { EventModule } from '../event/event.module';

@Module({
  imports: [UserProfileModule, EventModule],
  exports: [ProjectCollaborationService],
  providers: [ProjectCollaborationService],
  controllers: [ProjectCollaborationController],
})
export class ProjectCollaborationModule {}
