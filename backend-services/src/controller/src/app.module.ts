import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatadogTraceModule } from 'nestjs-ddtrace';
import { AssetModule } from './asset/asset.module';
import { AttachmentModule } from './attachment/attachment.module';
import { AuthModule } from './auth/auth.module';
import { CacheForRedisModule } from './cache-for-redis/cache-redis.module';
import { CertificationModule } from './certification/certification.module';
import { CompanyEvaluationNoteModule } from './company-evaluation-note/company-evaluation-note.module';
import { CompanyListModule } from './company-list/company-list.module';
import { CompanyNoteModule } from './company-note/company-note.module';
import { CompanyModule } from './company/company.module';
import { ContactModule } from './contact/contact.module';
import { ContingencyModule } from './contingency/contingency.module';
import { CoreModule } from './core/core.module';
import { DataPointModule } from './data-point/data-point.module';
import { DatabaseModule } from './database/database.module';
import { DiverseOwnershipModule } from './diverse-ownership/diverse-ownership.module';
import { EvaluationModule } from './evaluation/evaluation.module';
import { EventModule } from './event/event.module';
import { IndustryModule } from './industry/industry.module';
import { InsuranceModule } from './insurance/insurance.module';
import { LocationModule } from './location/location.module';
import { LoggingModule } from './logging/logging.module';
import { NotificationModule } from './notification/notification.module';
import { ProductModule } from './product/product.module';
import { ProjectCollaborationModule } from './project-collaboration/project-collaboration.module';
import { ProjectNoteModule } from './project-note/project-note.module';
import { ProjectModule } from './project/project.module';
import { ReportingModule } from './reporting/reporting.module';
import { SavedSearchModule } from './saved-search/saved-search.module';
import { ScenarioModule } from './scenario/scenario.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { ScoreLogicModule } from './score-logic/score-logic.module';
import { SearchModule } from './search/search.module';
import { SharedListModule } from './shared-list/shared-list.module';
import { StimulusScoreModule } from './stimulus-score/stimulus-score.module';
import { TagModule } from './tag/tag.module';
import { TenantCompanyRelationshipModule } from './tenant-company-relationship/tenant-company-relationship.module';
import { TenantModule } from './tenant/tenant.module';
import { UploadReportModule } from './upload-report/upload-report.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { UserModule } from './user/user.module';
import { GlobalProjectModule } from './project-tree/project-tree.module';
import { GlobalSupplierModule } from './global-supplier/global-supplier.module';
import { SupplierTierModule } from './supplier-tier/supplier-tier.module';
import { MinorityOwnershipDetailModule } from './minority-ownershipDetail/minority-ownershipDetail.module';
import { HealthModule } from './health/health.module';
import { BadgeModule } from './badge/badge.module';
import { CompanyAttachmentModule } from './company-attachment/company-attachment.module';
import { EmailModule } from './email/email.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatadogTraceModule.forRoot(),
    CoreModule,
    SchedulerModule,
    EventModule,
    LoggingModule,
    DatabaseModule,
    SearchModule,
    CompanyModule,
    ContactModule,
    ProductModule,
    InsuranceModule,
    CertificationModule,
    LocationModule,
    StimulusScoreModule,
    CompanyNoteModule,
    ProjectNoteModule,
    ContingencyModule,
    DataPointModule,
    ScenarioModule,
    UserModule,
    ProjectModule,
    TenantModule,
    ScoreLogicModule,
    SavedSearchModule,
    TenantCompanyRelationshipModule,
    UserProfileModule,
    NotificationModule,
    ProjectCollaborationModule,
    AttachmentModule,
    CompanyAttachmentModule,
    AssetModule,
    EvaluationModule,
    CompanyEvaluationNoteModule,
    CompanyListModule,
    IndustryModule,
    ReportingModule,
    UploadReportModule,
    SharedListModule,
    DiverseOwnershipModule,
    MinorityOwnershipDetailModule,
    BadgeModule,
    TagModule,
    AuthModule,
    HealthModule,
    GlobalProjectModule,
    GlobalSupplierModule,
    SupplierTierModule,
    CacheForRedisModule,
    EmailModule,
    ReportModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
