import { Inject, Injectable } from '@nestjs/common';
import { controller } from 'controller-proto/codegen/tenant_pb';
import { Connection, EntityManager, Repository } from 'typeorm';
import { GLOBAL_CONNECTION } from '../database/database.constants';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import {
  SupplierStatus,
  SupplierType,
  TenantCompanyRelationship,
} from '../tenant-company-relationship/tenant-company-relationship.entity';
import { UserTenant } from '../user/user-tenant.entity';
import { User } from '../user/user.entity';
import { Account } from './account.entity';
import { TenantCompany } from './tenant-company.entity';
import { ProvisionStatus, Tenant } from './tenant.entity';

@Injectable()
export class TenantService {
  private readonly tenantRepository: Repository<Tenant>;
  private readonly entityManager: EntityManager;
  private readonly tenantCompanyRelationshipRepository: Repository<TenantCompanyRelationship>;
  private readonly accountRepository: Repository<Account>;

  constructor(
    @Inject(GLOBAL_CONNECTION) connection: Connection,
    private readonly logger: StimulusLogger
  ) {
    this.logger.context = TenantService.name;
    this.entityManager = connection.manager;
    this.tenantRepository = this.entityManager.getRepository(Tenant);
    this.tenantCompanyRelationshipRepository = this.entityManager.getRepository(TenantCompanyRelationship);
    this.accountRepository = this.entityManager.getRepository(Account);
  }

  async getAllTenants(): Promise<any> {
    const tenants = await this.tenantRepository.find();
    return tenants;
  }

  async getById(id: string): Promise<Tenant> {
    return this.tenantRepository.findOneOrFail(id);
  }

  async getTenantsByStatusProvisioned(): Promise<any> {
    const tenants = await this.tenantRepository.find({ where: { provisionStatus: 'provisioned' } });
    return tenants;
  }

  async getUserAccount(tenantId: string) {
    return this.accountRepository.findOneOrFail({ tenant: { id: tenantId } });
  }

  async getAccountInfo(tenantId: string): Promise<any> {
    return this.tenantCompanyRelationshipRepository
      .createQueryBuilder('tcr')
      .where('tcr.tenantId =:id', { id: tenantId })
      .select('COUNT(tcr.id)', 'total')
      .addSelect(`SUM(case when tcr.status = '${SupplierStatus.ACTIVE}' then 1 else 0 end) as active`)
      .addSelect(`SUM(case when tcr.status = '${SupplierStatus.INACTIVE}' then 1 else 0 end) as inactive`)
      .addSelect(`SUM(case when tcr.status = '${SupplierStatus.ARCHIVED}' then 1 else 0 end) as archived`)
      .addSelect(`SUM(case when tcr.type = '${SupplierType.EXTERNAL}' then 1 else 0 end) as convertedFromExternal`)
      .getRawOne();
  }

  async createTenant(createTenantPayload: controller.ICreateTenantPayload): Promise<void> {
    return this.entityManager.transaction(async (transactionalEntityManager) => {
      const user = await transactionalEntityManager.findOneOrFail(User, {
        externalAuthSystemId: createTenantPayload.user.externalAuthSystemId,
      });
      const tenant = await transactionalEntityManager.save(Tenant, {
        provisionStatus: ProvisionStatus.QUEUED,
        name: createTenantPayload.company.name,
      });
      await transactionalEntityManager.save(UserTenant, {
        user,
        tenant,
        approved: false,
      });

      await transactionalEntityManager.save(Account, {
        tenant,
        ...(createTenantPayload.account as any),
      });
      await transactionalEntityManager.save(TenantCompany, {
        tenant,
        ...(createTenantPayload.company as any),
      });
    });
  }
}
