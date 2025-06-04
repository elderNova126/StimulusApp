import * as dotenv from 'dotenv';
import * as path from 'path';
import { ConnectionOptions } from 'typeorm';
import { Certification } from '../../certification/certification.entity';
import { Company } from '../../company/company.entity';
import { Contact } from '../../contact/contact.entity';
import { Contingency } from '../../contingency/contingency.entity';
import { DataPoint } from '../../data-point/data-point.entity';
import { Insurance } from '../../insurance/insurance.entity';
import { Location } from '../../location/location.entity';
import { Product } from '../../product/product.entity';
import { Score } from '../../stimulus-score/stimulus-score.entity';
import { Account } from '../../tenant/account.entity';
import { TenantCompany } from '../../tenant/tenant-company.entity';
import { Tenant } from '../../tenant/tenant.entity';
import { Role } from '../../user/role.entity';
import { UserTenant } from '../../user/user-tenant.entity';
import { User } from '../../user/user.entity';
import { CompanyNames } from 'src/company-names/company-names.entity';
import { ExternalSystemAuth } from 'src/auth/entities/externalSystemAuth.entity';
import { DiverseOwnership } from 'src/diverse-ownership/DiverseOwnership.entity';
import { DiverseOwnershipCompany } from 'src/diverse-ownership/DiverseOwnershipCompany.entity';
import { SharedList } from 'src/shared-list/shared-list.entity';
import { CompanyTag } from 'src/tag/companyTag.entity';
import { Tag } from 'src/tag/tag.entity';
import { AssetRelation } from '../../asset/asset-relation.entity';
import { Asset } from '../../asset/asset.entity';
import { CompanyLatestScore } from '../../company/company-latest-score.entity';
import { GlobalSupplier } from '../../global-supplier/global-supplier.entity';
import { Industry } from '../../industry/industry.entity';
import { GlobalProject } from '../../project-tree/project-tree.entity';
import { CompanyAggregateIndex } from '../../search/company-aggregate-index.entity';
import { CompanyFullAggregateIndex } from '../../search/company-full-aggregate-index.entity';
import { TenantCompanyRelationship } from '../../tenant-company-relationship/tenant-company-relationship.entity';
import { MinorityOwnershipDetail } from 'src/minority-ownershipDetail/minorityOwnershipDetail.entity';
import { MinorityOwnershipDetailCompany } from 'src/minority-ownershipDetail/minorityOwnershipDetailCompany.entity';
import { Badge } from 'src/badge/badge.entity';
import { BadgeTenantRelationship } from 'src/badge/badgeTenantRelationship.entity';
import { CompanyAttachment } from 'src/company-attachment/company-attachment.entity';

dotenv.config();

const config: ConnectionOptions = {
  type: 'mssql',
  migrationsRun: false,
  synchronize: false,
  username: process.env.GLOBAL_DB_USERNAME,
  password: process.env.GLOBAL_DB_PASSWORD,
  host: process.env.GLOBAL_DB_HOST,
  port: Number(process.env.GLOBAL_DB_PORT),
  database: process.env.GLOBAL_DB_NAME,
  schema: process.env.GLOBAL_DB_SCHEMA,
  entities: [
    Asset,
    AssetRelation,
    User,
    Account,
    Role,
    UserTenant,
    Tenant,
    TenantCompany,
    TenantCompanyRelationship,
    Tag,
    Company,
    CompanyNames,
    CompanyAggregateIndex,
    CompanyFullAggregateIndex,
    CompanyLatestScore,
    Contact,
    Product,
    Location,
    Insurance,
    Certification,
    Score,
    Contingency,
    DataPoint,
    Industry,
    SharedList,
    CompanyTag,
    DiverseOwnership,
    DiverseOwnershipCompany,
    MinorityOwnershipDetail,
    MinorityOwnershipDetailCompany,
    GlobalProject,
    GlobalSupplier,
    ExternalSystemAuth,
    Badge,
    BadgeTenantRelationship,
    CompanyAttachment,
  ],
  migrations: [
    path.resolve(__dirname, '..', 'migrations/global/*.ts'),
    path.resolve(__dirname, '..', 'migrations/global/*.js'),
  ],
  cli: {
    migrationsDir: 'src/database/migrations/global',
  },
  migrationsTableName: 'migrations',
  requestTimeout: 1 * 60 * 60 * 1000, // 1 hour
  maxQueryExecutionTime: 1 * 60 * 60 * 1000, // 1 hour
  pool: {
    max: 2000,
    min: 0,
  },
};

export = config;
