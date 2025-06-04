import { Inject, Injectable } from '@nestjs/common';
import { Connection, EntityManager, LessThanOrEqual, Like, MoreThanOrEqual, Repository } from 'typeorm';
import { ReqContextResolutionService } from '../core/req-context-resolution.service';
import { GLOBAL_CONNECTION, TENANT_CONNECTION } from '../database/database.constants';
import { Project } from '../project/project.entity';
import { IOrder, IOrderDTO } from '../shared/order.interface';
import { IPaginationDTO } from '../shared/pagination.interface';
import {
  GrpcAlreadyExistException,
  GrpcCanceledException,
  GrpcNotFoundException,
  GrpcUnauthenticatedException,
} from '../shared/utils-grpc/exception';
import { UserProfileService } from '../user-profile/user-profile.service';
import { UserTenant } from '../user/user-tenant.entity';
import { User } from '../user/user.entity';
import { CollaborationStatus, ProjectCollaboration, UserType } from './project-collaboration.entity';

@Injectable()
export class ProjectCollaborationService {
  private readonly projectRepository: Repository<Project>;
  private readonly projectCollaborationRepository: Repository<ProjectCollaboration>;
  private readonly userTenantRepository: Repository<UserTenant>;
  private readonly tenantEntityManager: EntityManager;

  constructor(
    @Inject(TENANT_CONNECTION) tenantConnection: Connection,
    @Inject(GLOBAL_CONNECTION) globalConnection: Connection,
    private userProfileService: UserProfileService,
    private readonly reqContextResolutionService: ReqContextResolutionService
  ) {
    this.projectRepository = tenantConnection.getRepository(Project);
    this.projectCollaborationRepository = tenantConnection.getRepository(ProjectCollaboration);

    this.userTenantRepository = globalConnection.getRepository(UserTenant);
    this.tenantEntityManager = tenantConnection.manager;
  }

  async sendProjectCollaboration(
    projectData: Project,
    externalAuthSystemId: string,
    type: UserType,
    status?: CollaborationStatus
  ): Promise<ProjectCollaboration> {
    const project = await this.projectRepository.findOneOrFail({ id: projectData.id });
    const tenantId = this.reqContextResolutionService.getTenantId();
    const userTenant = await this.userTenantRepository
      .createQueryBuilder('userTenant')
      .loadAllRelationIds({ relations: ['user', 'tenant'] })
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('user.id')
          .from(User, 'user')
          .where('user.externalAuthSystemId = :externalAuthSystemId ')
          .getQuery();

        return 'userId IN ' + subQuery;
      })
      .setParameter('externalAuthSystemId', externalAuthSystemId)
      .andWhere('tenantId = :tenantId', { tenantId })
      .getOne();

    if (!userTenant) throw new GrpcNotFoundException('User not found in tenant');

    const projectCollaboration = { project, userId: userTenant.userId, userType: type, ...(!!status && { status }) };
    const collaboration = await this.projectCollaborationRepository.findOne({ project, userId: userTenant.userId });
    if (collaboration?.status === CollaborationStatus.PENDING || collaboration?.status === CollaborationStatus.ACCEPT) {
      throw new GrpcAlreadyExistException('Invitation already exists.');
    }
    if (collaboration?.status === CollaborationStatus.REJECTED) {
      Object.assign(projectCollaboration, { id: collaboration.id });
      projectCollaboration.status = CollaborationStatus.PENDING;
    }
    return this.projectCollaborationRepository.save(projectCollaboration);
  }

  async sendProjectCollaborationWithUser(
    projectData: Project,
    type: UserType,
    status?: CollaborationStatus
  ): Promise<ProjectCollaboration> {
    const project = await this.projectRepository.findOneOrFail({ id: projectData.id });

    const projectCollaboration = {
      project,
      userId: projectData.createdBy,
      userType: type,
      ...(!!status && { status }),
    };
    const collaboration = await this.projectCollaborationRepository.findOne({ project, userId: projectData.createdBy });

    if (collaboration?.status === CollaborationStatus.PENDING || collaboration?.status === CollaborationStatus.ACCEPT) {
      throw new GrpcAlreadyExistException('Invitation already exists.');
    }
    if (collaboration?.status === CollaborationStatus.REJECTED) {
      Object.assign(projectCollaboration, { id: collaboration.id });
      projectCollaboration.status = CollaborationStatus.PENDING;
    }
    return this.projectCollaborationRepository.save(projectCollaboration);
  }

  async cancelCollaboration(collaborationId) {
    const collaboration = await this.projectCollaborationRepository.findOneOrFail({ id: collaborationId });

    if (collaboration.userType === UserType.OWNER) {
      throw new GrpcUnauthenticatedException('Insufficient permissions');
    }

    await this.projectCollaborationRepository.remove(collaboration); // an error is thrown if unsuccessful

    return true;
  }

  async setUserCollaboration(collaborationId, type) {
    const collaboration = await this.projectCollaborationRepository.findOneOrFail({ id: collaborationId });
    if (collaboration.status !== CollaborationStatus.PENDING)
      throw new GrpcCanceledException('Collaboration already accepted/rejected');
    collaboration.userType = type;
    return this.projectCollaborationRepository.save(collaboration);
  }

  async setCollaborationStatus(collaborationId, user, status) {
    const { id } = user;
    const tenantId = this.reqContextResolutionService.getTenantId();
    const userTenant = await this.userTenantRepository
      .createQueryBuilder('userTenant')
      .loadAllRelationIds({ relations: ['user', 'tenant'] })
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('user.id')
          .from(User, 'user')
          .where('user.externalAuthSystemId = :externalAuthSystemId ')
          .getQuery();

        return 'userId IN ' + subQuery;
      })
      .setParameter('externalAuthSystemId', id)
      .andWhere('tenantId = :tenantId', { tenantId })
      .getOne();

    if (!userTenant) throw new GrpcNotFoundException('User not found in tenant');

    const collaboration = await this.projectCollaborationRepository.findOneOrFail({
      relations: ['project'],
      where: {
        id: collaborationId,
        userId: userTenant.userId,
      },
    });
    if (collaboration.status !== CollaborationStatus.PENDING)
      throw new GrpcCanceledException('Collaboration already accepted/rejected');
    collaboration.status = status;

    this.userProfileService.subscribeToTopic({ projectIds: [`${collaboration.project.id}`] });
    return this.projectCollaborationRepository.save(collaboration);
  }

  async getUserCollaborations(
    externalAuthSystemId,
    pagination: IPaginationDTO,
    order: IOrderDTO,
    startDate: string,
    endDate: string,
    title: string,
    status: string
  ) {
    const tenantId = this.reqContextResolutionService.getTenantId();

    const userTenant = await this.userTenantRepository
      .createQueryBuilder('userTenant')
      .loadAllRelationIds({ relations: ['user', 'tenant'] })
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('user.id')
          .from(User, 'user')
          .where('user.externalAuthSystemId = :externalAuthSystemId ')
          .getQuery();

        return 'userId IN ' + subQuery;
      })
      .setParameter('externalAuthSystemId', externalAuthSystemId)
      .andWhere('tenantId = :tenantId', { tenantId })
      .getOne();

    if (!userTenant) throw new GrpcNotFoundException('User not found in tenant');

    return this.getCollaborationsByFilter(
      {
        userId: userTenant.userId,
        userType: UserType.COLLABORATOR,
        status,
        project: {
          startDate,
          endDate,
          title,
        },
      },
      pagination,
      order
    );
  }

  async getProjectCollaborations(filters, pagination: IPaginationDTO, order: IOrderDTO) {
    return this.getCollaborationsByFilter(filters, pagination, order);
  }

  async checkUserProjectCollaboration(externalAuthSystemId: string, projectId: number) {
    const tenantId = this.reqContextResolutionService.getTenantId();
    const userTenant = await this.userTenantRepository
      .createQueryBuilder('userTenant')
      .loadAllRelationIds({ relations: ['user', 'tenant'] })
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('user.id')
          .from(User, 'user')
          .where('user.externalAuthSystemId = :externalAuthSystemId ')
          .getQuery();

        return 'userId IN ' + subQuery;
      })
      .setParameter('externalAuthSystemId', externalAuthSystemId)
      .andWhere('tenantId = :tenantId', { tenantId })
      .getOne();
    if (!userTenant) throw new GrpcNotFoundException('User not found in tenant');

    const filters = {
      project: {
        id: projectId,
      },
      userId: userTenant.userId,
      status: CollaborationStatus.ACCEPT,
    };
    const [_results, count] = await this.getCollaborationsByFilter(filters);
    return count > 0 ? true : false;
  }

  private async getCollaborationsByFilter(
    filters,
    pagination: IPaginationDTO = {} as IPaginationDTO,
    order: IOrderDTO = {} as IOrderDTO
  ) {
    const { page, limit } = pagination;
    const { key = 'created', direction = 'DESC' } = order;
    const { project: projectData = {}, ...dataSearch } = filters;
    const { id, title, startDate, endDate } = projectData;

    const projectDataSearch = {
      ...(Object.keys(projectData).length > 0 && {
        project: {
          ...(title && { title: Like(`%${title}%`) }),
          ...(id && { id }),
          ...(startDate && { expectedStartDate: MoreThanOrEqual(startDate) }),
          ...(endDate && { endDate: LessThanOrEqual(endDate) }),
        },
      }),
    };
    const orderParams: IOrder = { ['projectCollaboration.' + key]: direction };
    const filtersProject = [projectDataSearch.project];
    // If we need to filter for startDate or endDate we need to check the project for Date and expectedDate in both cases

    if (startDate || endDate) {
      const searchExpectedDate = {
        ...projectDataSearch.project,
        ...(startDate && { expectedStartDate: MoreThanOrEqual(startDate) }),
        ...(endDate && { expectedStartDate: LessThanOrEqual(endDate) }),
      };
      filtersProject.push(searchExpectedDate);
      Object.assign(filtersProject[0], {
        ...(startDate && { expectedStartDate: MoreThanOrEqual(startDate) }),
        ...(endDate && { endDate: LessThanOrEqual(endDate) }),
      });
    }

    const results = await this.tenantEntityManager.transaction(async (transactionalEntityManager) => {
      let projectIds = [];
      if (filtersProject[0]) {
        const [results, _number] = await transactionalEntityManager.findAndCount(Project, { where: filtersProject });
        projectIds = results.map((project) => project.id);
      }

      const query = transactionalEntityManager
        .createQueryBuilder(ProjectCollaboration, 'projectCollaboration')
        .leftJoinAndSelect('projectCollaboration.project', 'project')
        .where(dataSearch);
      if (projectIds.length > 0 || !!projectData) {
        query.andWhere('projectId IN (' + projectIds + ')');
      }
      query.orderBy(orderParams);
      if (limit > 0) {
        query.take(limit).skip(limit * (page - 1));
      }
      return query.getManyAndCount();
    });
    return results;
  }
}
