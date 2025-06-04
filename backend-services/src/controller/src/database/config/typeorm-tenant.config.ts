import { UploadReport } from './../../upload-report/upload-report.entity';
import { CompanyList } from './../../company-list/company-list.entity';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { CompanyNote } from '../../company-note/company-note.entity';
import { Scenario } from '../../scenario/scenario.entity';
import { ConnectionOptions } from 'typeorm';
import { Project } from '../../project/project.entity';
import { ProjectCompany } from '../../project/projectCompany.entity';
import { ProjectNote } from '../../project-note/project-note.entity';
import { Event } from '../../event/event.entity';
import { SavedSearch } from '../../saved-search/saved-search.entity';
import { UserProfile } from '../../user-profile/user-profile.entity';
import { Notification } from '../../notification/notification.entity';
import { ProjectCollaboration } from '../../project-collaboration/project-collaboration.entity';
import { Attachment } from '../../attachment/attachment.entity';
import { CustomMetric } from '../../evaluation/custom-metric.entity';
import { EvaluationTemplate } from '../../evaluation/evaluation-template.entity';
import { CompanyEvaluation } from '../../evaluation/company-evaluation.entity';
import { CompanyEvaluationNote } from '../../company-evaluation-note/company-evaluation-note.entity';
import { Report } from '../../reporting/report.entity';
import { UploadReportErrors } from 'src/upload-report/upload-report-errors.entity';

dotenv.config();

const config: ConnectionOptions = {
  type: 'mssql',
  migrationsRun: false,
  synchronize: false,
  username: process.env.GLOBAL_DB_USERNAME,
  password: process.env.GLOBAL_DB_PASSWORD,
  host: process.env.TENANT_DB_HOST,
  database: process.env.GLOBAL_DB_NAME,
  port: Number(process.env.TENANT_DB_PORT),
  schema: 'montgomery_county_community_college',
  entities: [
    CompanyNote,
    ProjectNote,
    Scenario,
    Project,
    ProjectCompany,
    ProjectCollaboration,
    Event,
    Attachment,
    SavedSearch,
    UserProfile,
    Notification,
    EvaluationTemplate,
    CustomMetric,
    CompanyEvaluation,
    CompanyEvaluationNote,
    CompanyList,
    Report,
    UploadReport,
    UploadReportErrors,
  ],
  migrations: [
    path.resolve(__dirname, '..', 'migrations/tenant/*.ts'),
    path.resolve(__dirname, '..', 'migrations/tenant/*.js'),
  ],
  cli: {
    migrationsDir: 'src/database/migrations/tenant',
  },
  requestTimeout: 300000,
  maxQueryExecutionTime: 300000,
  pool: {
    max: 8000,
    min: 0,
  },
};

export = config;
