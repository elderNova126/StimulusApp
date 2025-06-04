import { Inject, Injectable } from '@nestjs/common';
import { EventCode } from 'src/event/event-code.enum';
import { StimulusLogger } from 'src/logging/stimulus-logger.service';
import { divideArrayEachOfToBatches } from 'src/utils/Arrays';
import { Between, Connection, DeleteResult, In, LessThanOrEqual, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { CompanyList } from '../company-list/company-list.entity';
import { ReqContextResolutionService } from '../core/req-context-resolution.service';
import { GLOBAL_CONNECTION, TENANT_CONNECTION } from '../database/database.constants';
import { CollaborationStatus, ProjectCollaboration } from '../project-collaboration/project-collaboration.entity';
import { ProjectStatus } from '../project/project.constants';
import { Project } from '../project/project.entity';
import { SharedList, SharedListStatus } from '../shared-list/shared-list.entity';
import { IOrderDTO } from '../shared/order.interface';
import { IPaginationDTO } from '../shared/pagination.interface';
import { GrpcFailedPreconditionException } from '../shared/utils-grpc/exception';
import { User } from '../user/user.entity';
import { EventCategoryType } from './event-code.enum';
import { Event } from './event.entity';

interface SearchOptions {
  notUserId?: string;
  fromTimestamp?: string;
  toTimestamp?: string;
  companyId: string;
  projectId: string;
  userId: string;
}
@Injectable()
export class EventService {
  private readonly eventRepository: Repository<Event>;
  private readonly projectCollaborationRepository: Repository<ProjectCollaboration>;
  private readonly projectRepository: Repository<Project>;
  private readonly companyListRepository: Repository<CompanyList>;
  private readonly userRepository: Repository<User>;
  private readonly sharedListRepository: Repository<SharedList>;

  constructor(
    @Inject(TENANT_CONNECTION) tenantConnection: Connection,
    @Inject(GLOBAL_CONNECTION) connection: Connection,
    private readonly reqContextResolutionService: ReqContextResolutionService,
    protected readonly logger: StimulusLogger
  ) {
    this.eventRepository = tenantConnection.getRepository(Event);
    this.projectCollaborationRepository = tenantConnection.getRepository(ProjectCollaboration);
    this.projectRepository = tenantConnection.getRepository(Project);
    this.companyListRepository = tenantConnection.getRepository(CompanyList);
    this.sharedListRepository = connection.getRepository(SharedList);
    this.userRepository = connection.getRepository(User);
    this.logger.context = EventService.name;
  }

  createFilterCreated(fromTimestamp?: string, toTimestamp?: string) {
    if (fromTimestamp && toTimestamp) {
      return Between(fromTimestamp, toTimestamp);
    } else if (fromTimestamp) {
      return MoreThanOrEqual(fromTimestamp);
    } else if (toTimestamp) {
      return LessThanOrEqual(toTimestamp);
    }
    return undefined;
  }

  filterCompanyEvents(events: Event, projectIds: number[], listIds: number[]): boolean {
    const { meta } = events;
    const { projectId, listId } = meta;
    return typeof projectId !== 'undefined'
      ? projectIds.includes(projectId)
      : typeof listId !== 'undefined'
        ? listIds.includes(listId)
        : true;
  }

  async getPorjectsIdsWithAccess(userId: string) {
    const projectWithAccest = await this.projectCollaborationRepository.find({
      where: {
        userId,
        status: CollaborationStatus.ACCEPT,
        project: {
          status: Not(ProjectStatus.CANCELED),
        },
      },
      relations: ['project'],
    });
    const projectCreatedByUser = await this.projectRepository.find({
      where: {
        createdBy: userId,
      },
    });
    return [...projectWithAccest.map((item) => item.project.id), ...projectCreatedByUser.map((item) => item.id)];
  }
  public async getListIdWithAccess(externalSystemId: string, internalSystemId: string) {
    const tenantId = this.reqContextResolutionService.getTenantId();

    const sharedListWithAccess = await this.sharedListRepository
      .createQueryBuilder()
      .where({
        createdBy: internalSystemId,
        tenant: {
          id: tenantId,
        },
      })
      .getMany();

    const invitationsAccepted = await this.sharedListRepository
      .createQueryBuilder()
      .where({
        userId: internalSystemId,
        tenant: {
          id: tenantId,
        },
      })
      .getMany();
    const acceptedSharedList = invitationsAccepted.filter((list) => list.status === SharedListStatus.ACCEPTED);

    const listCreatedByUser = await this.companyListRepository.find({
      where: {
        createdBy: externalSystemId,
      },
    });
    const listCreatedByUserIds = listCreatedByUser.map((item) => item.id);
    const sharedListIds = [...sharedListWithAccess, ...acceptedSharedList].map((item) => item.listId);

    return [...sharedListIds, ...listCreatedByUserIds];
  }

  private async getRelationSharedListEvent(events) {
    const relationEvents = await Promise.all(
      events.map(async (event) => {
        const { entityId } = event;
        if (event.code === EventCode.SHARED_LIST) {
          const [externarlEventSharedList] = await this.eventRepository.findAndCount({
            where: { code: EventCode.SHARED_LIST_CHANGE_STATUS, entityId },
            order: { created: 'DESC' },
          });
          return externarlEventSharedList;
        } else if (event.code === EventCode.SHARED_LIST_CHANGE_STATUS) {
          const [externarlEventSharedList] = await this.eventRepository.findAndCount({
            where: { code: EventCode.SHARED_LIST, entityId },
            order: { created: 'DESC' },
          });
          return externarlEventSharedList;
        }
      })
    );
    const relationEvents1 = [];
    relationEvents.forEach((event) => {
      return event && relationEvents1.push(event[0]);
    });

    return relationEvents1.filter((event) => event);
  }

  async getEvents(data: Event, pagination: { page: number; limit: number }, options?: SearchOptions) {
    const { page, limit } = pagination;
    const { userId: idFromUserLog, ...rest }: any = data;
    const filters: any = rest;
    const { fromTimestamp, toTimestamp, companyId, projectId, notUserId, userId: externalAuthSystemId } = options;
    const [{ id: internalUserID }] = await this.userRepository.find({ externalAuthSystemId });
    if (notUserId) {
      filters.userId = Not(options?.notUserId);
    }

    if (fromTimestamp || toTimestamp) {
      filters.created = this.createFilterCreated(fromTimestamp, toTimestamp);
    }

    if (companyId && !projectId) {
      filters.entityType = EventCategoryType.COMPANY;
      filters.entityId = companyId;
    }

    if (projectId && !companyId) {
      filters.entityType = EventCategoryType.PROJECT;
      filters.entityId = projectId;
    }
    if (idFromUserLog) {
      filters.userId = idFromUserLog;
    } else {
      filters.code = Not(EventCode.SHARED_LIST);
    }

    const paginationArgs = !pagination
      ? {}
      : {
          take: limit,
          skip: limit * (page - 1),
        };

    const projectIds = await this.getPorjectsIdsWithAccess(internalUserID);
    const companyListIds = await this.getListIdWithAccess(externalAuthSystemId, internalUserID);

    const [allEvents] = await this.eventRepository.findAndCount({
      where: { ...filters },
      order: { created: 'DESC' },
      ...paginationArgs,
    });

    const eventsFilteredByUser = allEvents.filter((event) => {
      const { entityType, meta, userId } = event;
      const { projectId, listId } = meta;

      const toFilter = {
        [EventCategoryType.PROJECT]: () =>
          typeof projectId !== 'undefined' ? projectIds.includes(projectId) : userId === externalAuthSystemId,
        [EventCategoryType.LIST]: () =>
          typeof listId !== 'undefined' ? companyListIds.includes(listId) : userId === externalAuthSystemId,
        [EventCategoryType.COMPANY]: () => this.filterCompanyEvents(event, projectIds, companyListIds),
      };
      return toFilter[entityType]();
    });

    const relations = await this.getRelationSharedListEvent(eventsFilteredByUser);
    const joindArrays = [...eventsFilteredByUser, ...relations];
    const count = joindArrays.length;

    return [joindArrays, count];
  }
  async getProjectEvents(
    projectId: number,
    pagination: IPaginationDTO,
    order: IOrderDTO,
    externalAuthSystemId: string
  ) {
    const { page, limit } = pagination;
    const { key = 'created', direction = 'DESC' } = order;
    const user = await this.userRepository.findOneOrFail({ externalAuthSystemId });
    const userHasAccessToProject = await this.projectCollaborationRepository.findOne({
      where: {
        project: { id: projectId },
        userId: user.id,
        status: CollaborationStatus.ACCEPT,
      },
    });
    if (!userHasAccessToProject) {
      throw new GrpcFailedPreconditionException('User does not have access to this project');
    }
    const filters = {
      entityType: EventCategoryType.PROJECT,
      entityId: projectId,
    };

    const orderParams = { [key]: direction };

    const paginationArgs = !limit
      ? {}
      : {
          take: limit,
          skip: limit * (page - 1),
        };

    return this.eventRepository.findAndCount({
      where: filters,
      order: orderParams,
      ...paginationArgs,
    });
  }

  getCompanyEvents(companyId: number, pagination: IPaginationDTO, order: IOrderDTO) {
    const { page, limit } = pagination;
    const { key = 'created', direction = 'DESC' } = order;

    const filters = {
      entityType: EventCategoryType.COMPANY,
      entityId: companyId,
      code: Not(In([EventCode.ADD_COMPANY_TO_PROJECT, EventCode.REMOVE_COMPANY_FROM_PROJECT])),
    };

    const orderParams = { [key]: direction };

    const paginationArgs = !limit
      ? {}
      : {
          take: limit,
          skip: limit * (page - 1),
        };

    return this.eventRepository.findAndCount({
      where: filters,
      order: orderParams,
      ...paginationArgs,
    });
  }

  async createEvent(eventData: Event): Promise<Event> {
    return this.eventRepository.save(eventData);
  }

  async findEventsByEntityIdInTenant(entitiesId: string[], tenantConnection: Connection): Promise<Event[]> {
    try {
      const eventRepository = tenantConnection.getRepository(Event);
      const result = await eventRepository.find({
        where: {
          entityId: In(entitiesId),
        },
      });
      return result;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async findEventsCompanyByBodyInTenant(companiesId: string[], tenantConnection: Connection): Promise<Event[]> {
    try {
      const eventRepository = tenantConnection.getRepository(Event);

      const query = eventRepository.createQueryBuilder('event');
      let t = 0;
      for (const companyId of companiesId) {
        query.orWhere(`event.body LIKE :${t}`, { [t]: `%${companyId}%` });
        t++;
      }
      const data = await query.getMany();

      return data;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async findEventsByMetaInTenant(companiesId: string[], tenantConnection: Connection): Promise<Event[]> {
    try {
      const eventRepository = tenantConnection.getRepository(Event);

      const query = eventRepository.createQueryBuilder('event');
      let t = 0;
      for (const companyId of companiesId) {
        query.orWhere(`event.meta LIKE :${t}`, { [t]: `%${companyId}%` });
        t++;
      }
      const data = await query.getMany();
      return data;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async deleteEvent(id: string): Promise<DeleteResult> {
    return this.eventRepository.delete(id);
  }

  async deleteEventsTenantByCompanyIds(id: string, tenantConnection: Connection): Promise<DeleteResult> {
    const eventRepository = tenantConnection.getRepository(Event);

    Promise.all([
      this.findEventsByEntityIdInTenant([id], tenantConnection),
      this.findEventsCompanyByBodyInTenant([id], tenantConnection),
      this.findEventsByMetaInTenant([id], tenantConnection),
    ])
      .then(async (response) => {
        const values = response.reduce((acc, val) => acc.concat(val), []);
        const ids = values.map((item) => item.id);

        if (ids.length === 0) {
          this.logger.log('No events to delete');
        } else {
          // remove per 1000 rows
          const idsArray = await divideArrayEachOfToBatches(ids, 1000);
          for (const ids of idsArray) {
            await eventRepository.delete({ id: In(ids) });
            this.logger.log(
              `Deleted ${ids.length} events for company ${id} in tenant ${tenantConnection.entityMetadatas[0].schema}`
            );
          }
        }
      })
      .catch((err) => {
        // log
        this.logger.error(
          `Error deleting events for company ${id}: ${err} in tenant ${tenantConnection.entityMetadatas[0].schema}`
        );
      });
    return;
  }

  async deleteEventsTenantByCompanies(ids: string[], tenantConnection: Connection): Promise<DeleteResult> {
    const eventRepository = tenantConnection.getRepository(Event);
    Promise.all([
      this.findEventsByEntityIdInTenant(ids, tenantConnection),
      this.findEventsCompanyByBodyInTenant(ids, tenantConnection),
      this.findEventsByMetaInTenant(ids, tenantConnection),
    ])
      .then(async (response) => {
        const values = response.reduce((acc, val) => acc.concat(val), []);
        const ids = values.map((item) => item.id);

        if (ids.length === 0) {
          this.logger.log('No events to delete');
        } else {
          // remove per 1000 rows
          const idsArray = await divideArrayEachOfToBatches(ids, 1000);
          for (const ids of idsArray) {
            await eventRepository.delete({ id: In(ids) });
            this.logger.log(
              `Deleted ${ids.length} events for ${ids.length} companies in tenant ${tenantConnection.entityMetadatas[0].schema}`
            );
          }
        }
      })
      .catch((err) => {
        this.logger.error(
          `Error deleting events for ${ids.length} companies: ${err} in tenant ${tenantConnection.entityMetadatas[0].schema}`
        );
      });
    return;
  }
}
