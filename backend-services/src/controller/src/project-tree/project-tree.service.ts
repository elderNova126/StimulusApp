import { Injectable, Inject } from '@nestjs/common';
import { Connection, DeleteResult, Repository, UpdateResult, In, TreeRepository } from 'typeorm';
import { GLOBAL_CONNECTION } from '../database/database.constants';
import { GlobalProject, EntityProjectType } from './project-tree.entity';
import { GlobalSupplier } from '../global-supplier/global-supplier.entity';
import { ReqContextResolutionService } from '../core/req-context-resolution.service';
import { Project } from '../project/project.entity';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { MIN_TIER_TO_UPWARD } from 'src/supplier-tier/supplier-tier.constants';

@Injectable()
export class GlobalProjectService {
  private readonly globalProjectRepository: TreeRepository<GlobalProject>;
  private readonly globalSupplierRepository: Repository<GlobalSupplier>;
  private readonly baseRelation: string = 'globalProject';
  private readonly parentProjectRelation: string = '.parentProject';
  private readonly parentProjectKey: string = 'parentProject';

  constructor(
    @Inject(GLOBAL_CONNECTION) connection: Connection,
    private readonly reqContextResolutionService: ReqContextResolutionService,
    private readonly logger: StimulusLogger
  ) {
    this.globalProjectRepository = connection.getTreeRepository(GlobalProject);
    this.globalSupplierRepository = connection.getRepository(GlobalSupplier);
  }

  async saveProjcetAndSupplier(project: Project, SuppliersIds: string[]): Promise<GlobalProject> {
    try {
      const { id: projectId, parentProjectTreeId } = project;
      const tenantId = this.reqContextResolutionService.getTenantId();
      let projectTree = await this.globalProjectRepository.findOne({
        where: { projectId, entityType: EntityProjectType.TENANT, entityId: tenantId },
      });
      if (!projectTree) {
        projectTree = await this.globalProjectRepository.save({
          projectId,
          entityType: EntityProjectType.TENANT,
          entityId: tenantId,
          parentProject: { id: parentProjectTreeId ? parentProjectTreeId : null },
        });
      }
      await this.globalSupplierRepository.save(
        SuppliersIds.map((supplierId) => {
          const supplier = new GlobalSupplier();
          supplier.globalProject = projectTree;
          supplier.companyId = supplierId;
          return supplier;
        })
      );
      return projectTree;
    } catch (error) {
      this.logger.error('Error in saveProjectAndSupplier', error);
    }
  }

  async getParentsProjectTreeFromSupplier({
    supplierId,
    tenantId,
    limit = 5,
    skip = 0,
  }: {
    supplierId: string;
    tenantId?: string;
    limit?: number;
    skip?: number;
  }): Promise<[GlobalProject[], number]> {
    try {
      if (!tenantId) tenantId = this.reqContextResolutionService.getTenantId();

      const [supplier, count] = await this.globalSupplierRepository.findAndCount({
        where: {
          companyId: supplierId,
          globalProject: { ...this.hadnleAncesntrWhereClause(tenantId, MIN_TIER_TO_UPWARD) },
        },
        relations: ['globalProject', ...this.handleAncesntrRelation(MIN_TIER_TO_UPWARD)],
        take: limit,
        skip,
        order: { id: 'DESC' },
      });
      if (!supplier) return [[], 0];

      return [supplier.map((s) => s.globalProject), count];
    } catch (error) {
      this.logger.error('Error in getParentsProjectTreeFromSupplier', error);
    }
  }

  private hadnleAncesntrWhereClause(parentId: string, NumberOfNodes: number, where?: any) {
    if (!where) where = {};
    const parent = { entityId: parentId };
    const iterations = NumberOfNodes - 1;
    let contador = 1;
    let ponter = where;
    while (contador <= iterations) {
      if (contador === iterations) {
        ponter[this.parentProjectKey] = parent;
      } else {
        ponter[this.parentProjectKey] = {};
        ponter = ponter[this.parentProjectKey];
      }
      contador++;
    }
    return where;
  }

  private handleAncesntrRelation(numberOfNodes: number, relations?: string[]) {
    if (!relations) relations = [];
    let relation = this.parentProjectRelation;
    while (relations.length < numberOfNodes - 1) {
      relations.push(this.baseRelation + relation);
      relation += this.parentProjectRelation;
    }
    return relations;
  }

  findParentProjectFromAtree(numberOfNode: number, projectTrees: GlobalProject[], tenantId?: string): GlobalProject[] {
    if (!tenantId) tenantId = this.reqContextResolutionService.getTenantId();
    const branchToFind = projectTrees.map((project) => {
      let parent = project;
      for (let i = 0; i < numberOfNode - 1; i++) {
        parent = parent?.parentProject;
      }
      if (parent && parent.entityId === tenantId) return project;
    });
    return branchToFind;
  }

  async findAll(): Promise<GlobalProject[]> {
    return this.globalProjectRepository.find();
  }

  async findByProjectId(projectIds: number, parentEntityId: string): Promise<GlobalProject[]> {
    return this.globalProjectRepository.find({
      where: { projectId: projectIds, entityId: parentEntityId },
      relations: ['parentProject', 'subProjects'],
    });
  }

  async findAllByFatherProjectIds(projectTreeIds: number[]): Promise<GlobalProject[]> {
    return this.globalProjectRepository.find({
      where: { parentProject: { id: In(projectTreeIds) } },
    });
  }

  async findOneByProjectTreeId(projectTreeId: number): Promise<GlobalProject> {
    return this.globalProjectRepository.findOne({
      where: { id: projectTreeId },
      relations: ['parentProject', 'subProjects'],
    });
  }

  async findByids(ids: number[]): Promise<GlobalProject[]> {
    return this.globalProjectRepository.find({
      where: { id: In(ids) },
    });
  }

  async create(globalProject: GlobalProject): Promise<GlobalProject> {
    return this.globalProjectRepository.save(globalProject);
  }

  async update(globalProject: GlobalProject): Promise<UpdateResult> {
    return this.globalProjectRepository.update(
      {
        projectId: globalProject.projectId,
        entityId: globalProject.entityId,
      },
      globalProject
    );
  }

  async delete(projectId: number, entityId: string): Promise<DeleteResult> {
    return this.globalProjectRepository.delete({ projectId, entityId });
  }
}
