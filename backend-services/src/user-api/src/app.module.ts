import { Module } from '@nestjs/common';
import { DatadogTraceModule } from 'nestjs-ddtrace';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { AssetModule } from './asset/asset.module';
import { AuthModule } from './auth/auth.module';
import { AzureStorageCredentialModule } from './azure-storage-credential/azure-storage-credential.module';
import { CertificationModule } from './certification/certification.module';
import { CompanyEvaluationNoteModule } from './company-evaluation-note/company-evaluation-note.module';
import { CompanyListModule } from './company-list/company-list.module';
import { CompanyNoteModule } from './company-note/company-note.module';
import { CompanyModule } from './company/company.module';
import { ContactModule } from './contact/contact.module';
import { ContingencyModule } from './contingency/contingency.module';
import { CoreModule } from './core/core.module';
import { DataPointModule } from './data-point/data-point.module';
import { EvaluationModule } from './evaluation/element.module';
import { EventModule } from './event/event.module';
import { IndustryModule } from './industry/industry.module';
import { IngestorModule } from './ingestor/ingestor.module';
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
import { SharedListModule } from './shared-list/shared_list.module';
import { HealthModule } from './health/health.module';
import { StimulusScoreModule } from './stimulus-score/stimulus-score.module';
import { TenantCompanyRelationshipModule } from './tenant-company-relationship/tenant-company-relationship.module';
import { TenantModule } from './tenant/tenant.module';
import { BadgeModule } from './badge/badge.module';
import { EmailModule } from './email/email.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: true,
      useGlobalPrefix: true,
      debug: process.env.NODE_ENV !== 'production',
      introspection: process.env.NODE_ENV !== 'production',
      playground: process.env.NODE_ENV !== 'production',
      cors: {
        origin: process.env.NODE_ENV === 'production' ? `${process.env.FRONTEND_URL}` : '*',
        credentials: true,
      },
      context: ({ req }) => ({ req }),
      formatError: (error) => {
        return {
          message: error.message,
          path: error.path,
          extensions: {
            code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
          },
        };
      },
    }),
    DatadogTraceModule.forRoot(),
    AuthModule,
    CoreModule,
    LoggingModule,
    CompanyModule,
    ContactModule,
    ProductModule,
    LocationModule,
    InsuranceModule,
    CertificationModule,
    StimulusScoreModule,
    CompanyNoteModule,
    ProjectNoteModule,
    ContingencyModule,
    DataPointModule,
    ScenarioModule,
    IngestorModule,
    ProjectModule,
    TenantModule,
    EventModule,
    SavedSearchModule,
    TenantCompanyRelationshipModule,
    NotificationModule,
    AssetModule,
    AzureStorageCredentialModule,
    ProjectCollaborationModule,
    EvaluationModule,
    CompanyEvaluationNoteModule,
    CompanyListModule,
    IndustryModule,
    ReportingModule,
    SharedListModule,
    HealthModule,
    BadgeModule,
    EmailModule,
    ReportModule,
  ],
  providers: [],
})
export class AppModule {}
