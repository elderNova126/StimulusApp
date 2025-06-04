import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import { ConnectionProviderService } from '../database/connection-provider.service';
import {
  TenantCompanyRelationship,
  SupplierStatus,
  SupplierType,
} from '../tenant-company-relationship/tenant-company-relationship.entity';
import { Event } from '../event/event.entity';
import { GlobalProject, EntityProjectType } from '../project-tree/project-tree.entity';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import {
  BUILD_TREE_FROM_TENANT_JOB,
  DATA_SET_SUPPLIER_TIER,
  SUPPLIER_TIER_QUEUE,
  FIND_TCR_TO_UPDATE_JOB,
  UPDATE_SUPPLIER_TIER_JOB,
  DO_TRASABILITY_JOB,
  CREATE_TCR_JOB,
  BullsOptions,
  PROGRESS,
} from './supplier-tier.constants';
import {
  SupplierTierJobData,
  FindSupplierTierJobData,
  UpdateSupplierTierJobData,
  TrasabilitySupplierTierJobData,
  CreateTCRJobData,
} from '../scheduler/stimulus-job-data.interface';
import { SupplierTierLogicService } from './supplier-tier-logic.service';
import { EventCode, EventCategoryType, EventLevel, actionType } from '../event/event-code.enum';
import { Tenant } from 'src/tenant/tenant.entity';

@Injectable()
@Processor(SUPPLIER_TIER_QUEUE)
export class SupplierTierProcessorService {
  constructor(
    @InjectQueue(SUPPLIER_TIER_QUEUE) private readonly supplierTierQueue: Queue,
    private connectionProviderService: ConnectionProviderService,
    private supplierTierLogicService: SupplierTierLogicService
  ) {}

  @Process(DATA_SET_SUPPLIER_TIER)
  async createQueueForSupplierTier() {
    const globalConnection = await this.connectionProviderService.getGlobalConnection();
    const globalProjectRepository = globalConnection.getTreeRepository(GlobalProject);
    const projectTrees = await globalProjectRepository.find({
      where: { entityType: EntityProjectType.COMPANY },
      select: ['id', 'entityId', 'projectId'],
    });
    if (projectTrees.length === 0) return;
    const projecTreeMap = new Map<string, GlobalProject[]>();

    for (const projectTree of projectTrees) {
      if (projecTreeMap.has(projectTree.entityId)) {
        projecTreeMap.get(projectTree.entityId).push(projectTree);
      } else {
        projecTreeMap.set(projectTree.entityId, [projectTree]);
      }
    }

    for (const [entityId, projects] of projecTreeMap) {
      await this.supplierTierQueue.add(BUILD_TREE_FROM_TENANT_JOB, { tenantId: entityId, projects }, BullsOptions);
    }
  }

  @Process(BUILD_TREE_FROM_TENANT_JOB)
  async calculateSupplierTierFromSingleTenantJob(job: Job<SupplierTierJobData>) {
    const { tenantId, projects } = job.data;
    if (projects.length === 0) return;
    for (const project of projects) {
      await this.supplierTierLogicService.buildtoUpwardTree(project.id, '5f8c8174-5b02-46e7-9b73-f5de37b2bd52');
      await this.supplierTierLogicService.buildDownwardTree(
        [project.id],
        project.id,
        tenantId,
        '5f8c8174-5b02-46e7-9b73-f5de37b2bd52'
      );
    }
  }

  @Process(FIND_TCR_TO_UPDATE_JOB)
  async setSupplierTier(job: Job<FindSupplierTierJobData>) {
    const { supplierIds, parentEntity, tier, projectTreeThatTriggered, userId } = job.data;
    const globalConnection = await this.connectionProviderService.getGlobalConnection();
    const tenantCompanyRelationshipRepository = globalConnection.getRepository(TenantCompanyRelationship);
    job.progress(PROGRESS.START);
    const tenantCompanyRelationship = await tenantCompanyRelationshipRepository.find({
      where: {
        company: { id: In(supplierIds) },
        tenant: { id: parentEntity },
      },
      select: ['id', 'supplierTier'],
    });

    if (supplierIds.length > tenantCompanyRelationship.length) {
      const supplierIdsNotInTCR = supplierIds.filter((s) => !tenantCompanyRelationship.find((t) => t.company.id === s));
      this.supplierTierQueue.add(
        CREATE_TCR_JOB,
        {
          supplierIds: supplierIdsNotInTCR,
          parentEntity,
          tier,
          projectTreeThatTriggered,
          userId,
        },
        { attempts: 1, ...BullsOptions }
      );
    }

    job.progress(PROGRESS.MIDDLE);
    const tenantCompanyRelationshipIds = tenantCompanyRelationship
      .filter((t) => t.supplierTier === null || t.supplierTier > tier)
      .map((t) => t.id);
    if (!tenantCompanyRelationshipIds.length) return;

    const tenantCompanyRelationshipIdsSlice =
      await this.supplierTierLogicService.sliceRowsToInsert(tenantCompanyRelationshipIds);

    job.progress(PROGRESS.CLOSE_TO_END);
    for (const tenantCompanyRelationshipIdsAfterSlice of tenantCompanyRelationshipIdsSlice) {
      this.supplierTierQueue.add(
        UPDATE_SUPPLIER_TIER_JOB,
        {
          tcrIds: tenantCompanyRelationshipIdsAfterSlice,
          tier,
          projectTreeThatTriggered,
          userId,
        },
        BullsOptions
      );
    }
    job.progress(PROGRESS.END);
  }
  @Process(UPDATE_SUPPLIER_TIER_JOB)
  async updateSupplierTier(job: Job<UpdateSupplierTierJobData>) {
    const { tcrIds, tier, projectTreeThatTriggered, userId } = job.data;
    const globalConnection = await this.connectionProviderService.getGlobalConnection();
    const tenantCompanyRelationshipRepository = globalConnection.getRepository(TenantCompanyRelationship);
    const update = await tenantCompanyRelationshipRepository.update(tcrIds, { supplierTier: tier });
    if (update.affected > 0)
      this.supplierTierQueue.add(
        DO_TRASABILITY_JOB,
        { tcrIds, tier, projectTreeThatTriggered, userId },
        { attempts: 2, ...BullsOptions }
      );
  }

  @Process(DO_TRASABILITY_JOB)
  async doTrasability(job: Job<TrasabilitySupplierTierJobData>) {
    const { tcrIds, tier, projectTreeThatTriggered, userId } = job.data;
    const globalConnection = await this.connectionProviderService.getGlobalConnection();
    const tenantCompanyRelationshipRepository = globalConnection.getRepository(TenantCompanyRelationship);
    const tcrs = await tenantCompanyRelationshipRepository.findByIds(tcrIds, {
      select: ['id', 'tenant', 'company'],
    });
    job.progress(PROGRESS.START);
    const tenantWithTcrs = new Map();
    for (const tcr of tcrs) {
      const {
        tenant: { id: tenantId },
      } = tcr;
      if (!tenantWithTcrs.has(tenantId)) {
        tenantWithTcrs.set(tenantId, []);
      }
      tenantWithTcrs.get(tenantId).push(tcr);
    }
    job.progress(PROGRESS.MIDDLE);
    for (const [tenantId, tcrs] of tenantWithTcrs) {
      const tenantConnection = await this.connectionProviderService.getTenantConnection(tenantId);
      const eventRepository = tenantConnection.getRepository(Event);
      const events: Event[] = [];
      for (const tcr of tcrs) {
        const { companyId } = tcr;
        const updates = [
          {
            id: 'supplierTier',
            to: `${tier}`,
          },
        ];
        const meta = {
          updates,
          companyId,
          projectId: projectTreeThatTriggered,
          actionType: actionType.UPDATE,
        };
        events.push({
          userId,
          code: EventCode.SET_SUPPLIER_TIER_COMPANY,
          entityType: EventCategoryType.COMPANY,
          level: EventLevel.INFO,
          entityId: companyId,
          body: `Company with id ${companyId} supplier tier set to ${tier}`,
          meta,
        } as Event);
      }
      await eventRepository.save(events);
    }
    job.progress(PROGRESS.END);
  }

  @Process(CREATE_TCR_JOB)
  async createTcr(job: Job<CreateTCRJobData>) {
    const { supplierIds, parentEntity, projectTreeThatTriggered, tier, userId } = job.data;
    job.progress(PROGRESS.START);
    const globalConnection = await this.connectionProviderService.getGlobalConnection();
    const tenantRepository = globalConnection.getRepository(Tenant);
    const tenant = await tenantRepository.findOne({ where: { id: parentEntity }, select: ['id'] });

    job.progress(PROGRESS.MIDDLE);
    if (!tenant) {
      job.moveToFailed(new Error('Tenant not found'));
      return;
    }
    const tenantCompanyRelationshipRepository = globalConnection.getRepository(TenantCompanyRelationship);
    const tenantCompanyRelationship = supplierIds.map((supplierId) => {
      return {
        company: { id: supplierId },
        tenant,
        supplierTier: tier,
        supplierStatus: SupplierStatus.INACTIVE,
        supplierType: SupplierType.EXTERNAL,
      };
    });

    job.progress(PROGRESS.CLOSE_TO_END);
    const newTcrs = await tenantCompanyRelationshipRepository.save(tenantCompanyRelationship);
    const tcrIds = newTcrs.map((t) => t.id);
    this.supplierTierQueue.add(
      DO_TRASABILITY_JOB,
      { tcrIds, tier, projectTreeThatTriggered, userId },
      { attempts: 2, ...BullsOptions }
    );

    job.progress(PROGRESS.END);
  }
}
