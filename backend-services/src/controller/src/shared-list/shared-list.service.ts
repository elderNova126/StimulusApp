import { Inject, Injectable } from '@nestjs/common';
import { CompanyListService } from 'src/company-list/company-list.service';
import { GLOBAL_CONNECTION } from 'src/database/database.constants';
import { EventCode } from 'src/event/event-code.enum';
import { InternalEventService } from 'src/event/internal-event.service';
import { StimulusLogger } from 'src/logging/stimulus-logger.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { SharedList, SharedListStatus } from './shared-list.entity';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class SharedListService {
  private readonly sharedListRepo: Repository<SharedList>;
  private readonly userRepository: Repository<User>;

  constructor(
    @Inject(GLOBAL_CONNECTION) connection,
    private readonly logger: StimulusLogger,
    private readonly companyListService: CompanyListService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private eventService: InternalEventService
  ) {
    this.logger.context = SharedListService.name;
    this.sharedListRepo = connection.getRepository(SharedList);
    this.userRepository = connection.getRepository(User);
  }

  async getSharedListById(id: number): Promise<any> {
    const sharedList = await this.sharedListRepo.findOne({
      where: { id },
    });
    return sharedList;
  }

  async getSharedList(sessionExternalUserId: string, sessionTenantId: string): Promise<any> {
    try {
      const user = await this.userRepository.findOneOrFail({
        externalAuthSystemId: sessionExternalUserId,
      });
      const sharedLists = await this.sharedListRepo.find({
        where: { user: { id: user.id }, tenant: { id: sessionTenantId } },
      });
      return this.mapperSharedListWithCompanyList(sharedLists);
    } catch (error) {
      console.log(error);
    }
  }

  async createdSharedList(sessionExternalUserId: string, shareListPayload: any): Promise<any> {
    try {
      const sessionUser = await this.userService.getADUserByExternalId(sessionExternalUserId);

      const user = await this.userService.getUserByInternalId(shareListPayload.userId);
      const fullUserInvited = await this.userService.getADUserByExternalId(user.externalAuthSystemId);
      const value = await this.userService.getADUserByExternalId(user.externalAuthSystemId);

      const newShareList = {
        listId: Number(shareListPayload.listId),
        userId: user.id,
        status: SharedListStatus.PENDING,
        tenant: {
          id: shareListPayload?.tenant?.id,
        },
        createdBy: sessionUser.id,
        created: new Date(),
      };
      const newSharedList = await this.sharedListRepo.save(newShareList);
      await this.eventService.dispatchInternalEvent({
        code: EventCode.SHARED_LIST,
        data: {
          sharedList: newSharedList,
          creator: sessionUser,
          userInvited: fullUserInvited,
        },
      });
      await this.emailService.sendPendingInvitationNotification({
        inviteUser: sessionUser.givenName,
        listName: shareListPayload.listName,
        name: value.givenName,
        toEmail: user.email,
      });

      return await this.getSharedListById(newSharedList.id);
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  async updateInvitation(_sessionExternalUserId: string, shareListPayload: any): Promise<any> {
    const sharedList = await this.sharedListRepo.findOneOrFail({
      where: {
        id: shareListPayload.id,
        listId: shareListPayload.listId,
      },
    });
    const user = await this.userService.getUserByInternalId(sharedList.userId);
    const fullUserInvited = await this.userService.getADUserByExternalId(user.externalAuthSystemId);
    const newStatus = this.mapperSharedListStatus(shareListPayload.status);
    sharedList.status = newStatus;
    const updatedSharedList = await this.sharedListRepo.save(sharedList);
    await this.eventService.dispatchInternalEvent({
      code: EventCode.SHARED_LIST_CHANGE_STATUS,
      data: {
        sharedList: updatedSharedList,
        userInvited: fullUserInvited,
      },
    });
    return updatedSharedList;
  }

  async getCollaboratorsList(sessionTenantId: string, shareListPayload: any): Promise<any> {
    try {
      // is the actual tenant
      if (shareListPayload?.tenant) {
        const sharedLists = await this.sharedListRepo.find({
          where: { listId: shareListPayload?.listId, tenant: { id: shareListPayload.tenant.id } },
        });
        return await this.getCollaboratorsFromSharedLists(sharedLists);
      } else {
        let sharedLists = await this.sharedListRepo.find({
          where: { listId: shareListPayload.listId, tenant: { id: sessionTenantId } },
        });
        sharedLists = this.clearDuplicateInvitations(sharedLists);
        return await this.getCollaboratorsFromSharedLists(sharedLists);
      }
    } catch (error) {
      console.log('Error : ', error);
    }
  }

  mapperSharedListStatus(status: string): SharedListStatus {
    switch (status) {
      case 'declined':
        return SharedListStatus.DECLINED;
      case 'accepted':
        return SharedListStatus.ACCEPTED;
      case 'pending':
        return SharedListStatus.PENDING;
      case 'deleted':
        return SharedListStatus.DELETED;
      default:
        return;
    }
  }

  async getCollaboratorsFromSharedLists(sharedLists: SharedList[]): Promise<any[]> {
    return Promise.all(
      sharedLists.map(async (sharedList) => {
        const user = await this.userService.getUsersById(sharedList.user.externalAuthSystemId);
        const sharedListExtraInfo = {
          sharedListId: sharedList.id,
          status: sharedList.status,
        };
        return { ...user, ...sharedListExtraInfo };
      })
    );
  }

  async mapperSharedListWithCompanyList(sharedLists: SharedList[]): Promise<any> {
    return Promise.all(
      sharedLists.map(async (sharedList) => {
        const companyList = await this.companyListService.getCompanyListsByTenant(
          sharedList.tenant.id,
          sharedList.listId.toString()
        );
        return { ...sharedList, companyList };
      })
    );
  }

  clearDuplicateInvitations(sharedLists: SharedList[]) {
    return sharedLists.filter(
      (sharedList, index, self) =>
        index === self.findIndex((t) => t.user.id === sharedList.user.id && t.listId === sharedList.listId)
    );
  }
}
