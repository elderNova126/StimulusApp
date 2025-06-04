import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GrpcNotFoundException, GrpcPermissionDeniedException } from '../../shared/utils-grpc/exception';
import { ProjectCollaborationService } from '../project-collaboration.service';

@Injectable()
export class ProjectCollaborationAuthGuard implements CanActivate {
  constructor(private projectCollaborationService: ProjectCollaborationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const type = context.getType();
    let userId;
    let projectId;
    if (type === 'rpc') {
      const body = context.getArgByIndex(0);
      if (body?.projectPayload) projectId = body?.projectPayload.project.id;
      else if (body?.projectId) projectId = body?.projectId;
      else projectId = body?.id;
      const metadata = context.getArgByIndex(1); // metadata
      if (!metadata) {
        return false;
      }
      userId = metadata.get('user')[0];
    }

    if (!userId || !projectId) {
      throw new GrpcNotFoundException(`UserId or projectId not found`);
    }

    const result = await this.projectCollaborationService.checkUserProjectCollaboration(userId, projectId);
    if (!result) throw new GrpcPermissionDeniedException(`Permission denied on project ${projectId} for use ${userId}`);

    return true;
  }
}
