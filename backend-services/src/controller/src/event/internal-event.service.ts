import { Injectable, Inject } from '@nestjs/common';
import { Event } from './event.entity';
import { EventCode, EventCategoryType, EventLevel, actionType } from './event-code.enum';
import { EventService } from './event.service';
import { ReqContextResolutionService } from '../core/req-context-resolution.service';
import { Repository, Connection } from 'typeorm';
import { Project } from '../project/project.entity';
import { Company } from '../company/company.entity';
import { GLOBAL_CONNECTION, TENANT_CONNECTION } from '../database/database.constants';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { NotificationService } from '../notification/notification.service';
import { UserService } from '../user/user.service';
import { CompanyList } from '../company-list/company-list.entity';
import { ConnectionProviderService } from 'src/database/connection-provider.service';

interface EventData {
  entityType: string;
  entityId: string;
  body: string;
  meta: any;
  level: string;
}
export interface DispatchEventsDTO {
  code: EventCode;
  data: any;
}
@Injectable()
export class InternalEventService {
  private readonly projectRepository: Repository<Project>;
  private readonly companyRepository: Repository<Company>;
  private readonly companyListRepository: Repository<CompanyList>;

  constructor(
    @Inject(TENANT_CONNECTION) tenantConnection: Connection,
    @Inject(GLOBAL_CONNECTION) globalConnection: Connection,
    private readonly eventService: EventService,
    protected readonly logger: StimulusLogger,
    private readonly reqContextResolutionService: ReqContextResolutionService,
    private notificationService: NotificationService,
    private userService: UserService,
    private connectionProviderService: ConnectionProviderService
  ) {
    this.projectRepository = tenantConnection.getRepository(Project);
    this.companyListRepository = tenantConnection.getRepository(CompanyList);
    this.companyRepository = globalConnection.getRepository(Company);
    this.logger.context = InternalEventService.name;
  }

  private readonly eventHandler = {
    [EventCode.REMOVE_FROM_COMPANY_LIST]: async (data: { listId: number; companyId: string }): Promise<EventData> => {
      const { listId, companyId } = data;
      const meta = {
        listId,
        listName: await this.getListName(listId),
        companyName: await this.getCompanyName({ id: companyId }),
        actionType: actionType.REMOVE,
      };
      const eventData = {
        entityType: EventCategoryType.COMPANY,
        entityId: companyId,
        body: `Company ${meta.companyName} with id: ${companyId} was remove to list ${meta.listName} with id: ${listId}`,
        meta,
        level: EventLevel.INFO,
      };
      return eventData;
    },
    [EventCode.ADD_TO_COMPANY_LIST]: async (data: { listId: number; companyId: string }): Promise<EventData> => {
      const { listId, companyId } = data;
      const meta = {
        listId,
        listName: await this.getListName(listId),
        companyName: await this.getCompanyName({ id: companyId }),
        actionType: actionType.ADDED,
      };
      const eventData = {
        entityType: EventCategoryType.COMPANY,
        entityId: companyId,
        body: `Company ${meta.companyName} with id: ${companyId} was added to list ${meta.listName} with id: ${listId}`,
        meta,
        level: EventLevel.INFO,
      };
      return eventData;
    },
    [EventCode.ADD_COMPANY_TO_PROJECT]: async (data: {
      project: any;
      companyId: string;
      type: string;
    }): Promise<EventData> => {
      const { project, companyId, type } = data;
      const meta = {
        projectId: project.id,
        projectName: await this.getProjectName(project),
        companyName: await this.getCompanyName({ id: companyId }),
        actionType: type,
      };

      const eventData = {
        entityType: EventCategoryType.COMPANY,
        entityId: companyId,
        body: `Company ${meta.companyName} with id: ${companyId} was ${meta.actionType} to project ${meta.projectName} with id: ${project.id}`,
        meta,
        level: EventLevel.INFO,
      };

      return eventData;
    },
    [EventCode.REMOVE_COMPANY_FROM_PROJECT]: async (data: { project: any; companyId: string }): Promise<EventData> => {
      const { project, companyId } = data;

      const meta = {
        projectId: project.id,
        projectName: await this.getProjectName(project),
        companyName: await this.getCompanyName({ id: companyId }),
        actionType: actionType.REMOVE,
      };

      const eventData = {
        entityType: EventCategoryType.COMPANY,
        entityId: companyId,
        body: `Company ${meta.companyName} with id: ${companyId} was removed from project ${meta.projectName} with id: ${project.id}`,
        meta,
        level: EventLevel.INFO,
      };

      return eventData;
    },

    [EventCode.UPDATE_PROJECT_COMPANIES]: async (data: {
      project: any;
      companyId: string;
      type: string;
    }): Promise<EventData> => {
      const { project, companyId, type } = data;
      const meta = {
        companyId,
        projectId: project.id,
        projectName: await this.getProjectName(project),
        companyName: await this.getCompanyName({ id: companyId }),
        actionType: type || actionType.REMOVE, // when removing a company from a project the type will be an empty string
      };

      const eventData = {
        entityType: EventCategoryType.PROJECT,
        entityId: `${project.id}`,
        body: `Company ${meta.companyName} with id: ${companyId} was ${meta.actionType} to project ${meta.projectName} with id: ${project.id}`,
        meta,
        level: EventLevel.INFO,
      };

      return eventData;
    },
    [EventCode.UPDATE_PROJECT_STATUS]: async (project: {
      id: number;
      title: string;
      status: string;
    }): Promise<EventData> => {
      const meta = {
        projectId: project.id,
        projectName: await this.getProjectName(project),
        status: project.status,
        actionType: actionType.UPDATE,
      };

      const eventData = {
        entityType: EventCategoryType.PROJECT,
        entityId: `${project.id}`,
        body: `Status of project ${meta.projectName} with id: ${project.id} was set to ${project.status}`,
        meta,
        level: EventLevel.INFO,
      };

      return eventData;
    },
    [EventCode.CREATE_PROJECT]: async (project: { id: number; title: string; status: string }): Promise<EventData> => {
      const meta = {
        projectId: project.id,
        projectName: await this.getProjectName(project),
        actionType: actionType.CREATE,
      };

      const eventData = {
        entityType: EventCategoryType.PROJECT,
        entityId: `${project.id}`,
        body: `Project ${meta.projectName} with id: ${project.id} was created`,
        meta,
        level: EventLevel.INFO,
      };

      return eventData;
    },
    [EventCode.UPDATE_COMPANY_SETTINGS]: async (settings: {
      id: string;
      company: any;
      isFavorite?: boolean;
      isToCompare?: boolean;
    }): Promise<EventData> => {
      let setting;
      let settingValue;

      if (typeof settings?.isFavorite !== 'undefined') {
        setting = 'isFavorite';
        settingValue = settings.isFavorite;
      } else if (typeof settings?.isToCompare !== 'undefined') {
        setting = 'isToCompare';
        settingValue = settings.isToCompare;
      }

      const meta = {
        companyId: settings.company.id,
        setting,
        settingValue,
        companyName: await this.getCompanyName(settings.company),
        actionType: actionType.UPDATE,
      };

      const eventData = {
        entityType: EventCategoryType.COMPANY,
        entityId: `${settings.company.id}`,
        body: `Settings changed for company ${meta.companyName} with id: ${settings.company.id}, ${setting} was set to ${settingValue}`,
        meta,
        level: EventLevel.INFO,
      };

      return eventData;
    },
    [EventCode.CANCEL_PROJECT]: async (project): Promise<EventData> => {
      const meta = {
        projectId: project.id,
        projectName: await this.getProjectName(project),
      };

      const eventData = {
        entityType: EventCategoryType.PROJECT,
        entityId: `${project.id}`,
        body: `Project ${meta.projectName} with id: ${project.id} was canceled`,
        meta,
        level: EventLevel.INFO,
      };

      return eventData;
    },
    [EventCode.PAUSE_PROJECT]: async (project): Promise<EventData> => {
      const { ongoing } = project;
      const meta = {
        projectId: project.id,
        projectName: await this.getProjectName(project),
        settingValue: ongoing,
      };

      const eventData = {
        entityType: EventCategoryType.PROJECT,
        entityId: `${project.id}`,
        body: `Project ${meta.projectName} with id: ${project.id} was set ${ongoing ? 'on going' : 'on hold'}`,
        meta,
        level: EventLevel.INFO,
      };

      return eventData;
    },
    [EventCode.ARCHIVE_PROJECT]: async (project): Promise<EventData> => {
      const meta = {
        projectName: await this.getProjectName(project),
        projectId: project.id,
      };

      const eventData = {
        entityType: EventCategoryType.PROJECT,
        entityId: `${project.id}`,
        body: `Project ${meta.projectName} with id: ${project.id} was archived`,
        meta,
        level: EventLevel.INFO,
      };

      return eventData;
    },
    [EventCode.EVALUATE_PROJECT_COMPANY]: async (data: { project; company }): Promise<EventData> => {
      const { project, company } = data;
      const meta = {
        companyId: company.id,
        projectId: project.id,
        projectName: await this.getProjectName(project),
        companyName: await this.getCompanyName(company),
      };

      const eventData = {
        entityType: EventCategoryType.PROJECT,
        entityId: `${project.id}`,
        body: `Company ${meta.companyName} with id ${company.id} was evaluated in the context of  Project ${meta.projectName} with id: ${project.id} was archived`,
        meta,
        level: EventLevel.INFO,
      };

      return eventData;
    },
    [EventCode.UPDATE_COMPANY_EVALUATION]: async (data: { project; company }): Promise<EventData> => {
      const { project, company } = data;
      const meta = {
        companyId: company.id,
        projectName: await this.getProjectName(project),
        companyName: await this.getCompanyName(company),
        actionType: actionType.UPDATE,
      };

      const eventData = {
        entityType: EventCategoryType.PROJECT,
        entityId: `${project.id}`,
        body: `Updated evaluation for Company ${meta.companyName} with id: ${company.id} in the context of Project ${meta.projectName} with id: ${project.id}`,
        meta,
        level: EventLevel.INFO,
      };

      return eventData;
    },
    [EventCode.ADD_PROJECT_COLLABORATORS]: async (data): Promise<EventData> => {
      const { project, userId, userType: type } = data;
      const user = await this.userService.getADUserByExternalId(userId);

      const meta = {
        userId,
        userName: `${user?.givenName ?? ''} ${user?.surname ?? ''}`,
        projectName: await this.getProjectName(project),
        type,
      };

      const eventData = {
        entityType: EventCategoryType.PROJECT,
        entityId: `${project.id}`,
        body: `User with id: ${userId} was invited to project ${meta.projectName} with id: ${project.id}`,
        meta,
        level: EventLevel.INFO,
      };

      return eventData;
    },
    [EventCode.RESPONSE_PROJECT_COLLABORATORS]: async (data): Promise<EventData> => {
      const { project, userId, status, userType: type } = data;
      const user = await this.userService.getADUserByExternalId(userId);

      const meta = {
        userId,
        userName: `${user?.givenName ?? ''} ${user?.surname ?? ''}`,
        projectName: await this.getProjectName(project),
        status,
        type,
      };

      const eventData = {
        entityType: EventCategoryType.PROJECT,
        entityId: `${project.id}`,
        body: `User with id: ${userId} respond invitation to project ${meta.projectName} with id: ${project.id} with status ${status} and type ${type}`,
        meta,
        level: EventLevel.INFO,
      };

      return eventData;
    },
    [EventCode.UPDATE_PROJECT_INFO]: async (data: { project; updates }): Promise<EventData> => {
      const { project, updates } = data;

      const meta = {
        projectName: await this.getProjectName(project),
        projectId: project.id,
        updates,
        actionType: actionType.UPDATE,
      };

      const eventData = {
        entityType: EventCategoryType.PROJECT,
        entityId: `${project.id}`,
        body: `Project ${meta.projectName} with id ${project.id} was updated with: ${updates}`,
        meta,
        level: EventLevel.INFO,
      };

      return eventData;
    },
    [EventCode.ANSWER_PROJECT_COMPANY_CRITERIA]: async (data: {
      projectId;
      projectCompany;
      answers;
    }): Promise<EventData> => {
      const { projectId, projectCompany, answers } = data;

      const meta = {
        projectName: await this.getProjectName({ id: projectId }),
        companyId: projectCompany.companyId,
        companyName: await this.getCompanyName({ id: projectCompany.companyId }),
        answers: JSON.stringify(answers),
      };

      const eventData = {
        entityType: EventCategoryType.PROJECT,
        entityId: `${projectId}`,
        body: `Answered Project criteria for ${meta.projectName} with id ${projectId} / ${meta.companyName} with id ${meta.companyId} was updated with: ${answers}`,
        meta,
        level: EventLevel.INFO,
      };

      return eventData;
    },
    [EventCode.UPDATE_COMPANY]: async (data: { company; updates }): Promise<EventData> => {
      const { company, updates } = data;

      const meta = {
        updates,
        actionType: actionType.UPDATE,
      };

      const eventData = {
        entityType: EventCategoryType.COMPANY,
        entityId: company.id,
        body: `Company ${company.legalBusinessName} with id ${company.id} was updated`,
        meta,
        level: EventLevel.INFO,
      };

      return eventData;
    },
    [EventCode.CREATE_COMPANY_INSURANCE]: async (data: { company; insurance }): Promise<EventData> => {
      const { company, insurance } = data;

      const meta = {
        id: insurance.id,
        companyName: await this.getCompanyName(company),
        companyId: company.id,
        actionType: actionType.CREATE,
      };

      const eventData = {
        entityType: EventCategoryType.COMPANY,
        entityId: company.id,
        body: `Insurance with id ${insurance.id} was created and linked to Company ${meta.companyName} with id ${company.id}`,
        meta,
        level: EventLevel.INFO,
      };

      return eventData;
    },
    [EventCode.UPDATE_COMPANY_INSURANCE]: async (data: { company; insurance; updates }): Promise<EventData> => {
      const { company, insurance, updates } = data;

      const meta = {
        id: insurance.id,
        updates,
        companyId: company.id,
        actionType: actionType.UPDATE,
      };

      const eventData = {
        entityType: EventCategoryType.COMPANY,
        entityId: company.id,
        body: `Insurance with id ${insurance.id} was updated`,
        meta,
        level: EventLevel.INFO,
      };

      return eventData;
    },
    [EventCode.CREATE_COMPANY_CERTIFICATION]: async (data: { company; certification }): Promise<EventData> => {
      const { company, certification } = data;

      const meta = {
        id: certification.id,
        companyName: await this.getCompanyName(company),
        companyId: company.id,
        actionType: actionType.CREATE,
      };

      const eventData = {
        entityType: EventCategoryType.COMPANY,
        entityId: company.id,
        body: `Certification with id ${certification.id} was created and linked to Company ${meta.companyName} with id ${company.id}`,
        meta,
        level: EventLevel.INFO,
      };

      return eventData;
    },
    [EventCode.UPDATE_COMPANY_CERTIFICATION]: async (data: { company; certification; updates }): Promise<EventData> => {
      const { company, certification, updates } = data;

      const meta = {
        id: certification.id,
        updates,
        companyId: company.id,
        actionType: actionType.UPDATE,
      };

      const eventData = {
        entityType: EventCategoryType.COMPANY,
        entityId: company.id,
        body: `Certification with id ${certification.id} was updated`,
        meta,
        level: EventLevel.INFO,
      };

      return eventData;
    },
    [EventCode.CREATE_COMPANY_CONTACT]: async (data: { company; contact }): Promise<EventData> => {
      const { company, contact } = data;

      const meta = {
        id: contact.id,
        companyName: await this.getCompanyName(company),
        companyId: company.id,
        actionType: actionType.CREATE,
      };

      const eventData = {
        entityType: EventCategoryType.COMPANY,
        entityId: company.id,
        body: `Contact with id ${contact.id} was created and linked to Company ${meta.companyName} with id ${company.id}`,
        meta,
        level: EventLevel.INFO,
      };

      return eventData;
    },
    [EventCode.UPDATE_COMPANY_CONTACT]: async (data: { company; contact; updates }): Promise<EventData> => {
      const { company, contact, updates } = data;

      const meta = {
        id: contact.id,
        updates,
        companyId: company.id,
        actionType: actionType.UPDATE,
      };

      const eventData = {
        entityType: EventCategoryType.COMPANY,
        entityId: company.id,
        body: `Contact with id ${contact.id} was updated`,
        meta,
        level: EventLevel.INFO,
      };

      return eventData;
    },
    [EventCode.CREATE_COMPANY_PRODUCT]: async (data: { company; product }): Promise<EventData> => {
      const { company, product } = data;

      const meta = {
        id: product.id,
        companyName: await this.getCompanyName(company),
        companyId: company.id,
        actionType: actionType.CREATE,
      };

      const eventData = {
        entityType: EventCategoryType.COMPANY,
        entityId: company.id,
        body: `Product with id ${product.id} was created and linked to Company ${meta.companyName} with id ${company.id}`,
        meta,
        level: EventLevel.INFO,
      };

      return eventData;
    },
    [EventCode.UPDATE_COMPANY_PRODUCT]: async (data: { company; product; updates }): Promise<EventData> => {
      const { company, product, updates } = data;

      const meta = {
        id: product.id,
        updates,
        companyId: company.id,
        actionType: actionType.UPDATE,
      };

      const eventData = {
        entityType: EventCategoryType.COMPANY,
        entityId: company.id,
        body: `Product with id ${product.id} was updated`,
        meta,
        level: EventLevel.INFO,
      };

      return eventData;
    },
    [EventCode.CREATE_COMPANY_LOCATION]: async (data: { company; location }): Promise<EventData> => {
      const { company, location } = data;

      const meta = {
        id: location.id,
        companyName: await this.getCompanyName(company),
        companyId: company.id,
        actionType: actionType.CREATE,
      };

      const eventData = {
        entityType: EventCategoryType.COMPANY,
        entityId: company.id,
        body: `Location with id ${location.id} was created and linked to Company ${meta.companyName} with id ${company.id}`,
        meta,
        level: EventLevel.INFO,
      };

      return eventData;
    },
    [EventCode.UPDATE_COMPANY_LOCATION]: async (data: { company; location; updates }): Promise<EventData> => {
      const { company, location, updates } = data;

      const meta = {
        id: location.id,
        updates,
        companyId: company.id,
        actionType: actionType.UPDATE,
      };

      const eventData = {
        entityType: EventCategoryType.COMPANY,
        entityId: company.id,
        body: `Location with id ${location.id} was updated`,
        meta,
        level: EventLevel.INFO,
      };

      return eventData;
    },
    [EventCode.CREATE_COMPANY_CONTINGENCY]: async (data: { company; contingency }): Promise<EventData> => {
      const { company, contingency } = data;

      const meta = {
        id: contingency.id,
        companyName: await this.getCompanyName(company),
        companyId: company.id,
        actionType: actionType.CREATE,
      };

      const eventData = {
        entityType: EventCategoryType.COMPANY,
        entityId: company.id,
        body: `Contingency with id ${contingency.id} was created and linked to Company ${meta.companyName} with id ${company.id}`,
        meta,
        level: EventLevel.INFO,
      };

      return eventData;
    },
    [EventCode.UPDATE_COMPANY_CONTINGENCY]: async (data: { company; contingency; updates }): Promise<EventData> => {
      const { company, contingency, updates } = data;

      const meta = {
        id: contingency.id,
        updates,
        companyId: company.id,
        actionType: actionType.UPDATE,
      };

      const eventData = {
        entityType: EventCategoryType.COMPANY,
        entityId: company.id,
        body: `Contingency with id ${contingency.id} was updated`,
        meta,
        level: EventLevel.INFO,
      };

      return eventData;
    },
    [EventCode.UPDATE_COMPANY_STATUS]: async (data: { company; status }): Promise<EventData> => {
      const { company, status } = data;

      const meta = {
        status,
        companyName: await this.getCompanyName(company),
        companyId: company.id,
        actionType: actionType.UPDATE,
      };

      const eventData = {
        entityType: EventCategoryType.COMPANY,
        entityId: company.id,
        body: `Status of Company ${meta.companyName} with id ${company.id} was set to ${status}`,
        meta,
        level: EventLevel.INFO,
      };

      return eventData;
    },
    [EventCode.UPDATE_COMPANY_TYPE]: async (data: { company; type }): Promise<EventData> => {
      const { company, type } = data;

      const meta = {
        type,
        companyName: await this.getCompanyName(company),
        companyId: company.id,
        actionType: actionType.UPDATE,
      };

      const eventData = {
        entityType: EventCategoryType.COMPANY,
        entityId: company.id,
        body: `Type of Company ${meta.companyName} with id ${company.id} was set to ${type}`,
        meta,
        level: EventLevel.INFO,
      };

      return eventData;
    },
    [EventCode.SHARED_LIST]: async (data: { sharedList: any; creator: any; userInvited: any }): Promise<EventData> => {
      const { sharedList, creator, userInvited } = data;
      const listName = await this.getListNameDifferentTenant(sharedList.listId, sharedList.tenant.id);
      const meta = {
        listId: sharedList.listId,
        listName,
        userId: sharedList.userId,
        tenantId: sharedList.tenant.id,
        status: sharedList.status,
        userInvited: userInvited.givenName,
      };
      const eventData = {
        entityType: EventCategoryType.LIST,
        entityId: sharedList.id,
        body: `${creator.givenName} ${creator.surname} Shared List "${meta.listName}" to ${userInvited.givenName} ${userInvited.surname}`,
        meta,
        level: EventLevel.INFO,
      };
      return eventData;
    },
    [EventCode.SHARED_LIST_CHANGE_STATUS]: async (data: { sharedList: any; userInvited: any }): Promise<EventData> => {
      const { sharedList, userInvited } = data;
      const listName = await this.getListNameDifferentTenant(sharedList.listId, sharedList.tenant.id);
      const meta = {
        listId: sharedList.listId,
        listName,
        userId: sharedList.userId,
        tenantId: sharedList.tenant.id,
        status: sharedList.status,
        userInvited: userInvited.givenName,
      };
      const eventData = {
        entityType: EventCategoryType.LIST,
        entityId: sharedList.id,
        body: `${userInvited.givenName} ${userInvited.surname} changed the list invite called "${
          meta.listName
        }" to ${sharedList.status.toUpperCase()}`,
        meta,
        level: EventLevel.INFO,
      };

      return eventData;
    },
    [EventCode.CREATE_COMPANY]: async (data: { company }): Promise<EventData> => {
      const { company } = data;

      const meta = {
        id: company?.id,
        companyName: company?.legalBusinessName,
        companyId: company?.id,
        actionType: actionType.CREATE,
      };

      const eventData = {
        entityType: EventCategoryType.COMPANY,
        entityId: company.id,
        body: `Company with id ${company?.id} was created with the name ${company?.legalBusinessName}`,
        meta,
        level: EventLevel.INFO,
      };

      return eventData;
    },
    [EventCode.SET_SUPPLIER_TIER_COMPANY]: async (data: { companyId; projectId; updates }): Promise<EventData> => {
      const { companyId, projectId, updates } = data;
      const companyName = await this.getCompanyName({ id: companyId });
      const meta = {
        updates,
        projectId,
        companyName,
        companyId,
        actionType: actionType.UPDATE,
      };
      const eventData = {
        entityType: EventCategoryType.COMPANY,
        entityId: companyId,
        body: `Company ${companyName} with id ${companyId} supplier tier set to ${updates.to}`,
        meta,
        level: EventLevel.INFO,
      };
      return eventData;
    },
  };

  async getListName(listId: number): Promise<string> {
    const list = await this.companyListRepository.find({ id: listId });
    return list[0]?.name;
  }

  async getListNameDifferentTenant(listId: number, tenantId): Promise<string> {
    const tenantConnection = await this.connectionProviderService.getTenantConnection(tenantId);
    const companyListRepository = tenantConnection.getRepository(CompanyList);
    const list = await companyListRepository.find({ id: listId });
    return list[0]?.name;
  }

  async getCompanyName(company: { id: string; legalBusinessName?: string }): Promise<string> {
    if (company?.legalBusinessName) {
      return company?.legalBusinessName;
    }
    const entireCompany = await this.companyRepository.find({ id: company.id });

    return entireCompany?.[0]?.legalBusinessName;
  }

  async getProjectName(project: { id: number; title?: string }): Promise<string> {
    if (project?.title) {
      return project?.title;
    }
    const entireProject = await this.projectRepository.find({ id: project.id });

    return entireProject[0]?.title;
  }

  async dispatchInternalEvent({ code, data }: DispatchEventsDTO) {
    try {
      const event = await this.eventHandler[code](data);
      const userId = this.reqContextResolutionService.getUserId();
      const savedEvent = await this.eventService.createEvent({ ...event, userId, code } as Event);
      await this.notificationService.dispatchNotification(savedEvent);
    } catch (error) {
      this.logger.error(`Error saving new event: ${error}`);
    }
  }

  async dispatchInternalEvents(eventsData: DispatchEventsDTO[]) {
    eventsData.forEach(this.dispatchInternalEvent.bind(this));
  }

  async deleteEventsByCompanyId(companyId: string, tenantConnection: Connection) {
    await this.eventService.deleteEventsTenantByCompanyIds(companyId, tenantConnection);
  }

  async deleteEventsByCompanies(companies: string[], tenantConnection: Connection) {
    await this.eventService.deleteEventsTenantByCompanies(companies, tenantConnection);
  }
}
