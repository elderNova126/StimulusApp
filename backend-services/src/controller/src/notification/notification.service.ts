import { Injectable, Inject } from '@nestjs/common';
import { UserProfileService } from '../user-profile/user-profile.service';
import { Notification } from './notification.entity';
import { Repository, MoreThanOrEqual, Connection } from 'typeorm';
import { TENANT_CONNECTION, GLOBAL_CONNECTION } from '../database/database.constants';
import { Event } from '../event/event.entity';
import { UserProfile } from '../user-profile/user-profile.entity';
import { EventCategoryType, EventCode } from '../event/event-code.enum';
import { IPaginationDTO } from '../shared/pagination.interface';
import { GrpcNotFoundException, GrpcUnauthenticatedException } from '../shared/utils-grpc/exception';
import { EventService } from '../event/event.service';
import { User } from '../user/user.entity';

interface GetNotificationProps {
  userId: string;
  pagination: IPaginationDTO;
  fromTimestamp: string;
  companiesOnly: boolean;
  projectsOnly: boolean;
  read?: boolean;
  companyIds: string[];
  projectIds: number[];
}
const BLACKLIST_CODES = [
  EventCode.ADD_COMPANY_TO_PROJECT,
  EventCode.REMOVE_COMPANY_FROM_PROJECT,
  EventCode.EVALUATE_PROJECT_COMPANY,
  EventCode.UPDATE_COMPANY_EVALUATION,
  EventCode.ANSWER_PROJECT_COMPANY_CRITERIA,
  EventCode.UPDATE_COMPANY,
  EventCode.CREATE_COMPANY_INSURANCE,
  EventCode.UPDATE_COMPANY_INSURANCE,
  EventCode.CREATE_COMPANY_CERTIFICATION,
  EventCode.UPDATE_COMPANY_CERTIFICATION,
  EventCode.CREATE_COMPANY_PRODUCT,
  EventCode.UPDATE_COMPANY_PRODUCT,
  EventCode.CREATE_COMPANY_LOCATION,
  EventCode.UPDATE_COMPANY_LOCATION,
  EventCode.CREATE_COMPANY_CONTACT,
  EventCode.UPDATE_COMPANY_CONTACT,
  EventCode.CREATE_COMPANY_CONTINGENCY,
  EventCode.UPDATE_COMPANY_CONTINGENCY,
  EventCode.SHARED_LIST,
];

@Injectable()
export class NotificationService {
  private readonly notificationRepository: Repository<Notification>;
  private readonly userRepository: Repository<User>;

  constructor(
    @Inject(TENANT_CONNECTION) connection: Connection,
    @Inject(GLOBAL_CONNECTION) globalConnection: Connection,
    protected readonly userProfileService: UserProfileService,
    protected readonly eventService: EventService
  ) {
    this.notificationRepository = connection.getRepository(Notification);
    this.userRepository = globalConnection.getRepository(User);
  }

  private checkSubscription(userProfile: UserProfile, event: Event) {
    if (event.userId === userProfile.id) {
      return false;
    } else if (event.entityType === EventCategoryType.COMPANY) {
      return userProfile.subscribedCompanies.indexOf(event.entityId) > -1;
    } else if (event.entityType === EventCategoryType.PROJECT) {
      return userProfile.subscribedProjects.indexOf(`${event.entityId}`) > -1;
    }
  }

  async getNotifications(data: GetNotificationProps) {
    const { userId, pagination, fromTimestamp, projectsOnly, companiesOnly, projectIds, companyIds, read } = data;
    const { limit = 10, page = 1 } = pagination;
    let userProfile: UserProfile;
    if (!userId) {
      userProfile = await this.userProfileService.getUserProfile(userId);
    }
    const filters = {
      userProfile: { id: userId ? userId : userProfile.id },
      ...(fromTimestamp && { created: MoreThanOrEqual(fromTimestamp) }),
      ...(typeof read !== 'undefined' && { read }),
    };

    const query = this.notificationRepository
      .createQueryBuilder('notification')
      .innerJoinAndSelect('notification.event', 'event')
      .where(filters)
      .andWhere('event.code NOT IN (:...codes)', { codes: BLACKLIST_CODES });

    if (projectsOnly) {
      query.andWhere('event.entityType=:entityType', { entityType: EventCategoryType.PROJECT });
    }
    if (companiesOnly) {
      query.andWhere('event.entityType=:entityType', { entityType: EventCategoryType.COMPANY });
    }
    if (projectIds?.length) {
      query
        .andWhere('event.entityType=:entityType', { entityType: EventCategoryType.PROJECT })
        .andWhere('event.entityId IN (:...entityIds)', { entityIds: projectIds });
    }
    if (companyIds?.length) {
      query
        .andWhere('event.entityType=:entityType', { entityType: EventCategoryType.COMPANY })
        .andWhere('event.entityId IN (:...entityIds)', { entityIds: companyIds });
    }
    if (limit > 0) {
      query.limit(limit).offset(limit * (page - 1));
    }

    return query.orderBy('notification.created', 'DESC').getManyAndCount();
  }

  async readNotification(id: number, read: boolean, userId: string) {
    const notification = await this.notificationRepository.preload({ id, read });

    if (!notification) {
      throw new GrpcNotFoundException('Notification not found');
    }
    if (notification?.userProfile?.id !== userId) {
      throw new GrpcUnauthenticatedException('Insufficient permissions');
    }
    return this.notificationRepository.save(notification);
  }

  async dispatchNotification(event: Event) {
    if (BLACKLIST_CODES.indexOf(event.code as EventCode) > -1) {
      return null;
    }

    if (event.code === EventCode.ADD_PROJECT_COLLABORATORS) {
      const userProfile = await this.userProfileService.getUserProfile(event.meta?.userId);
      return this.notificationRepository.save({ userProfile, event });
    }

    if (event.code === EventCode.ADD_TO_COMPANY_LIST) {
      const saveNotification: Notification[] = [];
      const { listId } = event.meta;
      const listIdLikeNumber = +listId;
      const userProfiles = await this.userProfileService.getTenantUserProfiles();

      for (const userProfile of userProfiles) {
        const [{ id: internalUserID }] = await this.userRepository.find({ externalAuthSystemId: userProfile.id });
        const ListsIds = await this.eventService.getListIdWithAccess(userProfile.id, internalUserID);

        if (ListsIds.indexOf(listIdLikeNumber) > -1) {
          saveNotification.push({ userProfile, event } as Notification);
        }
      }
      this.notificationRepository.save(saveNotification);
    }

    const userProfiles = await this.userProfileService.getTenantUserProfiles();
    userProfiles.forEach(
      (userProfile) =>
        this.checkSubscription(userProfile, event) && this.notificationRepository.save({ userProfile, event })
    );
  }
}
