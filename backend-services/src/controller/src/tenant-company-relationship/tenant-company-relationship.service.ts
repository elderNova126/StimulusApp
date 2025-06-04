import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { Queue } from 'bull';
import { controller } from 'controller-proto/codegen/tenant_pb';
import { from } from 'rxjs';
import { DefaultTimesForCache } from 'src/cache-for-redis/cache-redis.constants';
import { CacheRedisService } from 'src/cache-for-redis/cache-redis.service';
import { ProjectStatus } from 'src/project/project.constants';
import { Project } from 'src/project/project.entity';
import { Brackets, Connection, DeleteResult, In, Repository } from 'typeorm';
import { Company } from '../company/company.entity';
import { ReqContextResolutionService } from '../core/req-context-resolution.service';
import { ConnectionProviderService } from '../database/connection-provider.service';
import { GLOBAL_CONNECTION, TENANT_CONNECTION } from '../database/database.constants';
import { EventCode } from '../event/event-code.enum';
import { InternalEventService } from '../event/internal-event.service';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { StimulusJobData } from '../scheduler/stimulus-job-data.interface';
import { INDEXER_ON_DEMAND_JOB, SEARCH_QUEUE } from '../search/search.constants';
import {
  GrpcFailedPreconditionException,
  GrpcInvalidArgumentException,
  GrpcPermissionDeniedException,
} from '../shared/utils-grpc/exception';
import { ProvisionStatus, Tenant } from '../tenant/tenant.entity';
import { UserProfileService } from '../user-profile/user-profile.service';
import {
  SupplierStatus,
  SupplierStatusMapping,
  SupplierType,
  SupplierTypeMapping,
  TenantCompanyRelationship,
} from './tenant-company-relationship.entity';
import { TenantRelationStatsCollectionRepository } from './tenant-relation-stats-collection.repository';
import { TenantCompanyRelationType } from './tenant-company-relationship.constants';
/* eslint no-underscore-dangle: 0 */
@Injectable({ scope: Scope.REQUEST })
export class TenantCompanyRelationshipService {
  private readonly tenantCompanyRelationshipRepository: Repository<TenantCompanyRelationship>;
  private readonly tenantRepository: Repository<Tenant>;
  private readonly companyRepository: Repository<Company>;
  private readonly projectRepository: Repository<Project>;

  constructor(
    @Inject(GLOBAL_CONNECTION) globalConnection: Connection,
    @Inject(TENANT_CONNECTION) tenantConnection: Connection,
    @InjectQueue(SEARCH_QUEUE) private searchQueue: Queue<StimulusJobData<any>>,
    private readonly logger: StimulusLogger,
    private eventService: InternalEventService,
    private userProfileService: UserProfileService,
    private readonly reqContextResolutionService: ReqContextResolutionService,
    private connectionProviderService: ConnectionProviderService,
    private cacheRedisService: CacheRedisService
  ) {
    this.logger.context = TenantCompanyRelationshipService.name;
    this.tenantCompanyRelationshipRepository = globalConnection.getRepository(TenantCompanyRelationship);
    this.tenantRepository = globalConnection.getRepository(Tenant);
    this.companyRepository = globalConnection.getRepository(Company);
    this.projectRepository = tenantConnection.getRepository(Project);
  }

  private async _constructDefaultTenantCompanyRelationship(companyId, tenantId) {
    return {
      company: await this.companyRepository.findOneOrFail({
        where: {
          id: companyId,
        },
      }),
      tenant: await this.tenantRepository.findOneOrFail({
        where: {
          id: tenantId,
        },
      }),
    };
  }

  async setCompanyStatus(tenantId, companyData, status: SupplierStatus): Promise<boolean> {
    let tenantCompanyRelationship: any = await this.tenantCompanyRelationshipRepository.findOne({
      relations: ['company', 'tenant'],
      where: {
        tenant: {
          id: tenantId,
        },
        company: {
          id: companyData.id,
        },
      },
    });
    if (!tenantCompanyRelationship) {
      tenantCompanyRelationship = await this._constructDefaultTenantCompanyRelationship(companyData.id, tenantId);
    }

    switch (tenantCompanyRelationship.status) {
      case SupplierStatus.ACTIVE:
        if (!(status === SupplierStatus.INACTIVE || status === SupplierStatus.ACTIVE)) {
          throw new GrpcPermissionDeniedException('You cannot do this action');
        }
        if (
          status === SupplierStatus.INACTIVE &&
          ((await this.hasCompanyOnGoingProjects(companyData.id)) ||
            (await this.hasCompanyAboveThresholdDateProjects(companyData.id)))
        ) {
          throw new GrpcPermissionDeniedException(
            'You cannot do this action. The company have active projects attached'
          );
        }
        break;
      case SupplierStatus.INACTIVE:
        if (status !== SupplierStatus.ARCHIVED && status !== SupplierStatus.ACTIVE) {
          throw new GrpcPermissionDeniedException('You cannot do this action');
        }
        if (await this.hasCompanyAboveThresholdDateProjects(companyData.id)) {
          throw new GrpcPermissionDeniedException(
            'You cannot do this action. The company have active projects attached'
          );
        }
        break;
      case SupplierStatus.ARCHIVED:
        throw new GrpcPermissionDeniedException('You cannot do this action');
      default:
        throw new GrpcInvalidArgumentException('The selected state is invalid');
    }

    tenantCompanyRelationship.status = status;
    await this.tenantCompanyRelationshipRepository.save(tenantCompanyRelationship);
    await this.cacheRedisService.del(`internalAmount_${tenantId}`);
    const cacheCompany = await this.cacheRedisService.get(`company_${companyData.id}_${tenantId}`);
    const updateCache = cacheCompany ? JSON.parse(cacheCompany) : null;
    if (updateCache) {
      updateCache.tenantCompanyRelation.status = status;
      updateCache.tenantCompanyRelation.type = SupplierType.INTERNAL;
      this.cacheRedisService.set(
        `company_${companyData.id}_${tenantId}`,
        JSON.stringify(updateCache),
        DefaultTimesForCache.FORTY_SECONDS
      );
    }
    if ((await this.searchQueue.getWaitingCount()) < 1) await this.searchQueue.add(INDEXER_ON_DEMAND_JOB, {}, {});
    return true;
  }
  private async hasCompanyOnGoingProjects(companyId: string) {
    const ongoingProjects = await this.projectRepository
      .createQueryBuilder('project')
      .innerJoinAndSelect('project.projectCompany', 'projectCompany')
      .where('projectCompany.companyId = :companyId', { companyId })
      .andWhere(
        new Brackets((qb) => {
          qb.where('project.endDate is null')
            .andWhere('project.archived = :isArchived', { isArchived: false })
            .andWhere('project.deleted = :isDeleted', { isDeleted: false })
            .andWhere('project.status != :isCanceled', { isCanceled: ProjectStatus.CANCELED });
        })
      )
      .getManyAndCount();

    return ongoingProjects[1] > 0;
  }

  private async hasCompanyAboveThresholdDateProjects(companyId: string) {
    const thresholdDate = this.addMonths(new Date(), -TenantCompanyRelationship.archiveThresholdMonths);

    const aboveThresholdDateProjects = await this.projectRepository
      .createQueryBuilder('project')
      .innerJoinAndSelect('project.projectCompany', 'projectCompany')
      .where('projectCompany.companyId = :companyId', { companyId })
      .andWhere('project.endDate is not null')
      .andWhere('project.endDate > :thresholdDate', { thresholdDate })
      .getManyAndCount();

    return aboveThresholdDateProjects[1] > 0;
  }

  private addMonths(date, months) {
    date.setMonth(date.getMonth() + months);
    return date;
  }

  async setCompanyType(tenantId, companyIds, type: SupplierType): Promise<TenantCompanyRelationship[]> {
    const tenantCompanyRelationships: any = await this.tenantCompanyRelationshipRepository.find({
      relations: ['company', 'tenant'],
      where: {
        tenant: {
          id: tenantId,
        },
        company: {
          id: In(companyIds),
        },
      },
    });
    const companyIdsWithoutRelation = companyIds.filter(
      (id) => !tenantCompanyRelationships.find((relation) => relation.company.id === id)
    );
    const newRelations = await Promise.all(
      companyIdsWithoutRelation.map((id) => this._constructDefaultTenantCompanyRelationship(id, tenantId))
    );
    const relationsToSave = [...tenantCompanyRelationships, ...newRelations].map((relation) => ({ ...relation, type }));
    await this.cacheRedisService.del(`internalAmount_${tenantId}`);
    return this.tenantCompanyRelationshipRepository.save(relationsToSave);
  }

  async saveTenantCompanyRelation(tenantId, company, options): Promise<any> {
    const tenant = await this.tenantRepository.findOneOrFail({
      where: { id: tenantId },
    });

    const isTenantCompanyRelationshipExists = await this.tenantCompanyRelationshipRepository.find({
      company: { id: company.id },
      tenant: { id: tenantId },
    });

    if (isTenantCompanyRelationshipExists.length > 0) {
      throw new Error(`Tenant Company Relationship Exists. TenantId: ${tenant.id}, CompanyId: ${company.id}`);
    }

    const tenantCompanyRelationship = { tenant, company } as TenantCompanyRelationship;
    if (options.supplierStatus) tenantCompanyRelationship.status = options.supplierStatus;
    if (options.supplierType) tenantCompanyRelationship.type = options.supplierType;
    if (company.internalId) tenantCompanyRelationship.internalId = company.internalId;
    if (company.parentCompanyInternalId)
      tenantCompanyRelationship.parentCompanyInternalId = company.parentCompanyInternalId;
    return this.tenantCompanyRelationshipRepository.save(tenantCompanyRelationship);
  }

  async getTCRFromTenantContext(companyInternalId: string) {
    const tenantId = this.reqContextResolutionService.getTenantId();
    return this.tenantCompanyRelationshipRepository.findOneOrFail({
      relations: ['company'],
      where: {
        internalId: companyInternalId,
        tenant: { id: tenantId },
      },
    });
  }

  async getTCRFromTenantContextByCompanies(companyInternalIds: string[]) {
    const tenantId = this.reqContextResolutionService.getTenantId();
    return this.tenantCompanyRelationshipRepository.find({
      relations: ['company'],
      where: {
        internalId: In(companyInternalIds),
        tenant: { id: tenantId },
      },
    });
  }

  async getTCRsFromTenantContext(companyInternalIds: string[]) {
    const tenantId = this.reqContextResolutionService.getTenantId();
    return this.tenantCompanyRelationshipRepository.find({
      relations: ['company'],
      where: {
        internalId: In(companyInternalIds),
        tenant: { id: tenantId },
      },
    });
  }

  async getTenantCompanyRelation(filters: TenantCompanyRelationship) {
    const result = await this.tenantCompanyRelationshipRepository.find({
      relations: ['company', 'tenant'],
      where: filters,
    });
    if (result) return result;

    const tenantId = filters.tenant?.id ?? this.reqContextResolutionService.getTenantId();
    const tenantCompanyRelationship: any = await this._constructDefaultTenantCompanyRelationship(
      filters.company.id,
      tenantId
    );
    tenantCompanyRelationship.status = SupplierStatusMapping[controller.SupplierStatus.INACTIVE];
    tenantCompanyRelationship.type = SupplierTypeMapping[controller.SupplierType.EXTERNAL];
    tenantCompanyRelationship.isFavorite = false;
    tenantCompanyRelationship.isToCompare = false;
    return [tenantCompanyRelationship];
  }

  async getOverviewProjects(data: any) {
    const tenantId = this.reqContextResolutionService.getTenantId();
    const tenantRelations = await this.getTenantCompanyRelation({
      company: { id: data.companyId },
    } as TenantCompanyRelationship);

    const response = (tenantRelations ?? []).reduce(
      (acc, curr) => {
        if (curr.tenant?.id === tenantId) {
          acc.accountEvaluations = curr.noOfEvaluations;
          acc.accountProjects = curr.noOfProjects;
          acc.accountSpent = acc.accountSpent > 0 ? acc.accountSpent : Number(curr.totalSpent);
        }

        acc.globalSpent += Number(curr.totalSpent);
        acc.totalProjects += curr.noOfProjects;
        acc.totalEvaluations += curr.noOfEvaluations;

        return acc;
      },
      {
        globalSpent: 0,
        totalProjects: 0,
        accountProjects: 0,
        accountSpent: 0,
        accountEvaluations: 0,
        totalEvaluations: 0,
      }
    );

    return response;
  }

  createTenantCompanyRelation(
    tenantCompanyRelationData: TenantCompanyRelationship
  ): Promise<TenantCompanyRelationship> {
    return this.tenantCompanyRelationshipRepository.save(tenantCompanyRelationData);
  }

  async bulkUpdateTenantCompanyRelations(data) {
    const tenantId = this.reqContextResolutionService.getTenantId();
    const { companyIds, tenantCompanyRelation } = data;
    const { isFavorite, isToCompare } = tenantCompanyRelation;
    const tenantRelations = [];
    for (const id of companyIds) {
      const relation = await this.tenantCompanyRelationshipRepository.findOne({
        relations: ['company'],
        where: {
          company: { id },
          tenant: {
            id: tenantId,
          },
        },
      });

      tenantRelations.push({
        company: { id },
        tenant: {
          id: tenantId,
        },
        ...relation,
        ...(isFavorite && { isFavorite }),
        ...(isToCompare && { isToCompare }),
        ...(isFavorite === true && { favoriteUpdatedAt: new Date().toISOString() }),
      });
    }
    await this.cacheRedisService.del(`favoritesAmount_${tenantId}`);
    if ((await this.searchQueue.getWaitingCount()) < 1) await this.searchQueue.add(INDEXER_ON_DEMAND_JOB, {}, {});
    return this.tenantCompanyRelationshipRepository.save(tenantRelations);
    // @TODO: add event & notifications
  }

  async updateTenantCompanyRelation(
    relationId: string,
    tenantCompanyRelationData: TenantCompanyRelationship
  ): Promise<TenantCompanyRelationship> {
    const { isFavorite, isToCompare, company } = tenantCompanyRelationData;
    const tenantId = this.reqContextResolutionService.getTenantId();

    const companyId = !!company?.id ? company.id : tenantCompanyRelationData.companyId;

    let companyRelation: any = await this.tenantCompanyRelationshipRepository.findOne({
      relations: ['company'],
      where: {
        ...(relationId && { id: relationId }),
        company: { id: companyId },
        tenant: {
          id: tenantId,
        },
      },
    });

    if (!companyRelation) {
      companyRelation = {
        company: tenantCompanyRelationData.company,
        tenant: {
          id: tenantId,
        },
        ...(isFavorite && { isFavorite }),
        ...(isToCompare && { isToCompare }),
        ...(isFavorite === true && { favoriteUpdatedAt: new Date().toISOString() }),
      };
    } else {
      companyRelation = await this.tenantCompanyRelationshipRepository.preload({
        ...companyRelation,
        ...tenantCompanyRelationData,
        ...(isFavorite === true && { favoriteUpdatedAt: new Date().toISOString() }),
      });
    }

    const isNotInternalActive =
      companyRelation.type &&
      (companyRelation.type !== SupplierType.INTERNAL || companyRelation.status !== SupplierStatus.ACTIVE);
    if (isToCompare === true && isNotInternalActive) {
      throw new GrpcFailedPreconditionException(
        'Company needs to be internal active to proceed add to comparison action'
      );
    } else {
      if (companyRelation.id)
        await this.tenantCompanyRelationshipRepository.update({ id: companyRelation.id }, companyRelation);
      else companyRelation = await this.tenantCompanyRelationshipRepository.save(companyRelation);
    }

    if (isFavorite === true) {
      await this.userProfileService.subscribeAllUsersToTopic({ companyIds: [tenantCompanyRelationData.company.id] });
    }
    if (
      typeof tenantCompanyRelationData.isFavorite !== 'undefined' ||
      typeof tenantCompanyRelationData.isToCompare !== 'undefined'
    ) {
      from(
        this.eventService.dispatchInternalEvent({
          code: EventCode.UPDATE_COMPANY_SETTINGS,
          data: { ...tenantCompanyRelationData, id: companyRelation.id },
        })
      ).subscribe(() => {
        if (isFavorite === false) {
          // after notification is sent, unsubscribe if is no loger a favorite company
          this.userProfileService.unsubscribeAllUsersFromTopic({ companyIds: [tenantCompanyRelationData.company.id] });
        }
      });
    }
    await this.cacheRedisService.del(`favoritesAmount_${tenantId}`);
    if ((await this.searchQueue.getWaitingCount()) < 1) await this.searchQueue.add(INDEXER_ON_DEMAND_JOB, {}, {});
    return companyRelation;
  }

  async deleteTenantCompanyRelation(id: string): Promise<DeleteResult> {
    return this.tenantCompanyRelationshipRepository.delete(id);
  }

  async addProjectRelation(companyId: string) {
    const tenantId = this.reqContextResolutionService.getTenantId();

    const companyRelation: any = await this.tenantCompanyRelationshipRepository.findOneOrFail({
      company: { id: companyId },
      tenant: {
        id: tenantId,
      },
    });

    companyRelation.noOfProjects++;

    return this.tenantCompanyRelationshipRepository.save(companyRelation);
  }

  async addRelationSpent(companyId: string, spent: number, otherTenantId?: string) {
    const tenantId = this.reqContextResolutionService.getTenantId();
    let companyRelation: any = await this.tenantCompanyRelationshipRepository.findOneOrFail({
      relations: ['company'],
      where: {
        company: { id: companyId },
        tenant: {
          id: otherTenantId || tenantId,
        },
      },
    });
    if (!companyRelation) {
      companyRelation = await this._constructDefaultTenantCompanyRelationship(companyId, tenantId);
    }
    const totalSpent: number = Number(companyRelation.totalSpent) + Number(spent);
    companyRelation.totalSpent = totalSpent;

    return this.tenantCompanyRelationshipRepository.save(companyRelation);
  }

  async addEvaluationRelation(companyId: string) {
    const tenantId = this.reqContextResolutionService.getTenantId();

    const companyRelation: any = await this.tenantCompanyRelationshipRepository.findOneOrFail({
      company: { id: companyId },
      tenant: {
        id: tenantId,
      },
    });

    companyRelation.noOfEvaluations++;

    return this.tenantCompanyRelationshipRepository.save(companyRelation);
  }

  async updateRelationStats() {
    const tenants = await this.tenantRepository.find({
      where: { provisionStatus: ProvisionStatus.PROVISIONED },
    });
    let tenantRelations = [];
    for (const tenant of tenants) {
      const relations = await this.tenantCompanyRelationshipRepository.find({
        relations: ['company'],
        where: { tenant },
      });
      const tenantConnection = await this.connectionProviderService.getTenantConnection(tenant.id);
      const projectStatsRepository = await tenantConnection.getCustomRepository(
        TenantRelationStatsCollectionRepository
      );

      const stats = await projectStatsRepository.getStatsData();
      const updatedRelations = relations
        .filter((relation) => !!stats[relation.company.id])
        .map((relation) => ({ ...relation, ...stats[relation.company.id] }));
      const updates = await this.tenantCompanyRelationshipRepository.save(updatedRelations, {
        chunk: Math.ceil(updatedRelations.length / 1000),
      });
      tenantRelations = [...tenantRelations, ...updates];
    }

    return { results: tenantRelations };
  }

  async updateProjectInfo(companyId: string, spent: number) {
    const tenantId = this.reqContextResolutionService.getTenantId();
    const companyRelation: any = await this.tenantCompanyRelationshipRepository.findOneOrFail({
      relations: ['company'],
      where: {
        company: { id: companyId },
        tenant: {
          id: tenantId,
        },
      },
    });

    companyRelation.noOfProjects++;
    companyRelation.totalSpent += spent;

    return this.tenantCompanyRelationshipRepository.save(companyRelation);
  }

  async getCompanyRelationByCompanyIds(companyIds: string[]): Promise<TenantCompanyRelationship[]> {
    try {
      const tenantId = this.reqContextResolutionService.getTenantId();
      const relations = await this.tenantCompanyRelationshipRepository.find({
        relations: ['company'],
        where: {
          company: { id: In(companyIds) },
          tenant: { id: tenantId },
        },
      });
      return relations;
    } catch (error) {
      this.logger.error(`Error while getting company relations by company ids: ${error}`);
    }
  }

  async getCompanyRelationByCompanyId(companyId: string): Promise<TenantCompanyRelationship> {
    const tenantId = this.reqContextResolutionService.getTenantId();
    const companyRelation = await this.tenantCompanyRelationshipRepository.find({
      relations: ['company'],
      where: {
        company: { id: companyId },
        tenant: {
          id: tenantId,
        },
      },
    });

    return companyRelation[0];
  }

  async getCompanyRelationByFavorite(): Promise<TenantCompanyRelationship[]> {
    try {
      const tenantId = this.reqContextResolutionService.getTenantId();

      const companyRelation: any = await this.tenantCompanyRelationshipRepository.find({
        relations: ['company'],
        where: {
          tenant: {
            id: tenantId,
          },
          isFavorite: true,
        },
      });

      return companyRelation.length > 0 ? companyRelation : [];
    } catch (error) {
      console.log(error);
    }
  }

  async countCompanyRelationByFavorite(): Promise<number> {
    try {
      const tenantId = this.reqContextResolutionService.getTenantId();
      const amountFromCache = await this.cacheRedisService.get(`favoritesAmount_${tenantId}`);
      if (amountFromCache) {
        return JSON.parse(amountFromCache);
      } else {
        const companyRelation: any = await this.tenantCompanyRelationshipRepository.count({
          where: {
            tenant: {
              id: tenantId,
            },
            isFavorite: true,
          },
        });
        await this.cacheRedisService.set(
          `favoritesAmount_${tenantId}`,
          JSON.stringify(companyRelation),
          DefaultTimesForCache.ONE_MINUTE
        );
        return companyRelation;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async countInternalCompany(): Promise<number> {
    try {
      const tenantId = this.reqContextResolutionService.getTenantId();
      const amountFromCache = await this.cacheRedisService.get(`internalAmount_${tenantId}`);
      if (amountFromCache) {
        return JSON.parse(amountFromCache);
      } else {
        const companyRelations: any = await this.tenantCompanyRelationshipRepository.count({
          where: {
            tenant: {
              id: tenantId,
            },
            type: TenantCompanyRelationType.INTERNAL,
          },
        });

        await this.cacheRedisService.set(
          `internalAmount_${tenantId}`,
          JSON.stringify(companyRelations),
          DefaultTimesForCache.ONE_DAY
        );
        return companyRelations;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async countCompanyRelationByAll(): Promise<number> {
    try {
      const amountFromCache = await this.cacheRedisService.get(`allCompanies`);
      if (amountFromCache) {
        return JSON.parse(amountFromCache);
      } else {
        const companyRelations: any = await this.tenantCompanyRelationshipRepository.count();

        await this.cacheRedisService.set(
          `allCompanies`,
          JSON.stringify(companyRelations),
          DefaultTimesForCache.ONE_DAY
        );

        return companyRelations;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getTCRByInternalId(internalId: string): Promise<TenantCompanyRelationship> {
    const tenantId = this.reqContextResolutionService.getTenantId();
    return this.tenantCompanyRelationshipRepository.findOne({
      where: {
        internalId,
        tenant: {
          id: tenantId,
        },
      },
    });
  }
}
