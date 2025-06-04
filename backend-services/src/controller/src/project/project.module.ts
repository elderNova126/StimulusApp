import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { EvaluationModule } from '../evaluation/evaluation.module';
import { EventModule } from '../event/event.module';
import { GlobalSupplierModule } from '../global-supplier/global-supplier.module';
import { ProjectCollaborationModule } from '../project-collaboration/project-collaboration.module';
import { GlobalProjectModule } from '../project-tree/project-tree.module';
import { SCORE_QUEUE } from '../score-logic/score-job.constants';
import { ScoreLogicModule } from '../score-logic/score-logic.module';
import { TenantCompanyRelationshipModule } from '../tenant-company-relationship/tenant-company-relationship.module';
import { UploadReportModule } from '../upload-report/upload-report.module';
import { UserProfileModule } from '../user-profile/user-profile.module';
import { ProjectStreamController } from './project-stream.controller';
import { ProjectStreamService } from './project-stream.service';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
@Module({
  imports: [
    GlobalSupplierModule,
    GlobalProjectModule,
    ScoreLogicModule,
    EventModule,
    UserProfileModule,
    ProjectCollaborationModule,
    EvaluationModule,
    UploadReportModule,
    TenantCompanyRelationshipModule,
    UserModule,
    BullModule.registerQueue({
      name: SCORE_QUEUE,
    }),
  ],
  controllers: [ProjectController, ProjectStreamController],
  providers: [ProjectService, ProjectStreamService],
  exports: [ProjectService],
})
export class ProjectModule {}
