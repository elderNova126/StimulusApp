import { Injectable, Inject } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { GLOBAL_CONNECTION } from '../database/database.constants';
import { Tenant, ProvisionStatus } from '../tenant/tenant.entity';
import { GlobalProjectService } from '../project-tree/project-tree.service';
import { ReqContextResolutionService } from '../core/req-context-resolution.service';
import { GlobalProject } from '../project-tree/project-tree.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import {
  MAX_TIER,
  SUPPLIER_TIER_QUEUE,
  MIN_TIER_TO_UPWARD,
  FIND_TCR_TO_UPDATE_JOB,
  BullsOptions,
} from './supplier-tier.constants';
@Injectable()
export class SupplierTierLogicService {
  private readonly tenantRepository: Repository<Tenant>;

  constructor(
    @InjectQueue(SUPPLIER_TIER_QUEUE) private readonly supplierTierQueue: Queue,
    @Inject(GLOBAL_CONNECTION) private readonly connection: Connection,
    private readonly globalProjectService: GlobalProjectService,
    private readonly reqContextResolutionService: ReqContextResolutionService
  ) {
    this.tenantRepository = this.connection.getRepository(Tenant);
  }

  async calculateSupplierTier(projectTreeId: number) {
    if (process.env.SUPPLIER_TIER === 'false' || !process.env.SUPPLIER_TIER) {
      return;
    }
    const tenantId = this.reqContextResolutionService.getTenantId();
    const userId = this.reqContextResolutionService.getUserId();
    this.buildtoUpwardTree(projectTreeId, userId);
    this.buildDownwardTree([projectTreeId], projectTreeId, tenantId, userId);
  }

  async buildtoUpwardTree(projectTreeId: number, userId: string) {
    let projectTree = await this.globalProjectService.findOneByProjectTreeId(projectTreeId);
    if (!projectTree?.parentProject?.id) return;
    const projectTreeThatTriggered = projectTreeId;
    const allTenantsId = await this.getProvisionedTenats();
    const supplierIds = projectTree.GlobalSupplier.map((s) => s.companyId);

    for (let CurrentTier = MIN_TIER_TO_UPWARD; MAX_TIER > CurrentTier; CurrentTier++) {
      projectTree = await this.globalProjectService.findOneByProjectTreeId(projectTree.parentProject.id);
      if (allTenantsId.has(projectTree.entityId)) {
        this.supplierTierQueue.add(
          FIND_TCR_TO_UPDATE_JOB,
          {
            supplierIds,
            parentEntity: projectTree.entityId,
            tier: CurrentTier,
            projectTreeThatTriggered,
            userId,
          },
          BullsOptions
        );
      }
    }
  }

  async buildDownwardTree(
    projectIds: number[],
    projectTreeThatTriggered: number,
    currentTenant: string,
    userId: string,
    tier = 1
  ) {
    if (tier > MAX_TIER) return;
    if (!(await this.getProvisionedTenats())?.has(currentTenant)) return;

    const supplierIds: Set<string> = new Set();
    const projectTreeIds: Set<number> = new Set();

    const projectTree = await this.globalProjectService.findByids(projectIds);
    if (!projectTree.length) return;

    for (const project of projectTree) {
      projectTreeIds.add(project.id);
      for (const supplier of project.GlobalSupplier) {
        supplierIds.add(supplier.companyId);
      }
    }
    if (!supplierIds.size) return;

    const supplierIdsChunks = this.sliceRowsToInsert([...supplierIds], 1000);
    for (const supplierIdsChunk of supplierIdsChunks) {
      this.supplierTierQueue.add(
        FIND_TCR_TO_UPDATE_JOB,
        {
          supplierIds: supplierIdsChunk,
          parentEntity: currentTenant,
          tier,
          projectTreeThatTriggered,
          userId,
        },
        BullsOptions
      );
    }

    const nextProjects = await this.globalProjectService.findAllByFatherProjectIds([...projectTreeIds]);

    if (!nextProjects.length) return;

    const nextProjectsIds = nextProjects.map((p) => p.id);
    this.buildDownwardTree(nextProjectsIds, projectTreeThatTriggered, currentTenant, userId, tier + 1);
    return;
  }

  async getProvisionedTenats() {
    const allTenants = await this.tenantRepository.find({
      select: ['id'],
      where: { provisionStatus: ProvisionStatus.PROVISIONED },
    });
    const allTenantsId = new Set(allTenants.map((t) => t.id));
    return allTenantsId;
  }

  sliceRowsToInsert(
    rows: string[] | number[] | GlobalProject[],
    toSlice = 2000
  ): string[][] | number[][] | GlobalProject[][] {
    const totalRounds = Math.ceil(rows.length / toSlice);
    const rowsWithSlice = [];
    for (let i = 0; i < totalRounds; i++) {
      const rowsSlice = rows.slice(i * toSlice, (i + 1) * toSlice);
      rowsWithSlice.push(rowsSlice);
    }
    return rowsWithSlice;
  }
}
