import { Client } from '@microsoft/microsoft-graph-client';
import { Inject, Injectable } from '@nestjs/common';
import { controller } from 'controller-proto/codegen/tenant_pb';
import { Connection, Repository } from 'typeorm';
import { AD_CLIENT } from '../core/ad.providers';
import { ReqContextResolutionService } from '../core/req-context-resolution.service';
import { GLOBAL_CONNECTION } from '../database/database.constants';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { GrpcNotFoundException } from '../shared/utils-grpc/exception';
import { Tenant } from '../tenant/tenant.entity';
import { Role, UserRole } from './role.entity';
import { UserEmailService } from './user-email.service';
import { UserTenant } from './user-tenant.entity';
import { User } from './user.entity';

@Injectable()
export class UserService {
  private readonly userRepository: Repository<User>;
  private readonly tenantRepository: Repository<Tenant>;
  private readonly userTenantRepository: Repository<UserTenant>;
  private readonly roleRepository: Repository<Role>;
  constructor(
    @Inject(GLOBAL_CONNECTION) connection: Connection,
    @Inject(AD_CLIENT) private readonly adClient: Client,
    private readonly userEmailService: UserEmailService,
    private readonly reqContextResolutionService: ReqContextResolutionService,
    private readonly logger: StimulusLogger
  ) {
    this.userRepository = connection.getRepository(User);
    this.tenantRepository = connection.getRepository(Tenant);
    this.userTenantRepository = connection.getRepository(UserTenant);
    this.roleRepository = connection.getRepository(Role);
  }

  async getUserSettings(_id): Promise<string> {
    // todo: use input for below query
    const user = await this.userRepository.findOne();

    return user.settings;
  }

  async createUser(user: controller.IUser) {
    return this.userRepository.save(user);
  }

  async provisionUser(user: controller.IUser): Promise<controller.IUser> {
    const { externalAuthSystemId, email } = user;
    const externalUser = await this.adClient.api(`/users/${externalAuthSystemId}`).get();
    if (!externalUser) {
      throw new GrpcNotFoundException(`External user with id ${externalAuthSystemId} not found`);
    }
    let stimulusUser = await this.userRepository.findOne({ email });
    if (stimulusUser) {
      stimulusUser.externalAuthSystemId = externalAuthSystemId;
      await this.userRepository.save(stimulusUser);
    } else {
      stimulusUser = await this.userRepository.save(user);
    }
    const sentMessageInfo = await this.userEmailService.sendUserProvisionedEmailAdmin(stimulusUser, externalUser);
    this.logger.log(JSON.stringify(sentMessageInfo));
    return stimulusUser;
  }

  async provisionTenantUser(email: string, resend: boolean): Promise<controller.IUser> {
    let stimulusUser = await this.userRepository.findOne({ email });
    let newUser = false;
    if (!stimulusUser) {
      stimulusUser = await this.userRepository.save({
        email,
      });
      newUser = true;
    }

    const userProvisioned = !!stimulusUser.externalAuthSystemId;

    const currentTenantId = this.reqContextResolutionService.getTenantId();
    const currentTenant = await this.tenantRepository.findOne({ id: currentTenantId });

    const adminRole = await this.roleRepository.findOne({
      name: UserRole.ADMIN,
    });
    let userTenant = await this.userTenantRepository
      .createQueryBuilder('user_tenant')
      .innerJoinAndSelect('user_tenant.user', 'user')
      .innerJoinAndSelect('user_tenant.tenant', 'tenant')
      .innerJoinAndSelect('user_tenant.roles', 'role')
      .where('user.id = :userId', {
        userId: stimulusUser.id,
      })
      .andWhere('user_tenant.tenantId = :tenantId', { tenantId: currentTenantId })
      .getOne();
    let newUserTenant = false;
    if (!userTenant) {
      // TODO approved: false when the invitation acceptance mechanism is built
      userTenant = await this.userTenantRepository.save({
        user: stimulusUser,
        tenant: currentTenant,
        approved: true,
        roles: [adminRole],
      });
      newUserTenant = true;
    }
    // TODO if(resend) - Update userTenantRepository with new invitation context
    this.logger.log(JSON.stringify(userTenant));
    let sentMessageInfo;
    if (newUser || (resend && !userProvisioned)) {
      sentMessageInfo = await this.userEmailService.sendNewUserTenantInvitationEmail(stimulusUser, currentTenant);
    } else if (newUserTenant || resend) {
      sentMessageInfo = await this.userEmailService.sendUserTenantInvitationEmail(stimulusUser, currentTenant);
    }
    if (sentMessageInfo) {
      this.logger.log(JSON.stringify(sentMessageInfo));
    }

    return stimulusUser;
  }

  async requestAccess(userRequest: controller.IUserRequest): Promise<boolean> {
    const { externalAuthSystemId } = userRequest;
    try {
      const user = await this.userRepository.findOneOrFail({ externalAuthSystemId });
      const sentMessageInfo = await this.userEmailService.sendUserRequestedAccessEmailAdmin(user);
      this.logger.log(JSON.stringify(sentMessageInfo));
      return true;
    } catch (err) {
      this.logger.error(err);
      return false;
    }
  }
  async getUserByExternalIdOrFail(externalAuthSystemId: string) {
    return this.userRepository.findOneOrFail({ where: { externalAuthSystemId } });
  }

  async getUserByExternalId(externalAuthSystemId: string) {
    return this.userRepository.findOne({ where: { externalAuthSystemId } });
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findOne({
      email,
    });
  }

  async getADUserByExternalId(externalAuthSystemId: string) {
    return this.adClient.api(`/users/${externalAuthSystemId}`).get();
  }

  async getADUserByInternalId(externalAuthSystemId: string) {
    return this.adClient.api(`/users/${externalAuthSystemId}`).get();
  }

  private prepareADQueryString = (options: { select?: string[] } | undefined) => {
    if (!options) return '';
    let queryString = '';
    const { select } = options;

    if (select) {
      queryString += `&$select=${select}`;
    }

    return queryString;
  };

  async getADUsersByExternalIds(externalIds: string[], options?: { select?: string[] }) {
    const preparedIds = externalIds.map((id) => `'${id}'`);

    const selectQueryString = this.prepareADQueryString(options);
    return this.adClient.api(`/users/?$filter=id in (${preparedIds})${selectQueryString}`).get();
  }

  async getUsersByNameAndSurname(value: string, _options?: { select?: string[] }) {
    const tenantId = this.reqContextResolutionService.getTenantId();
    const response = await this.adClient
      .api(`/users/`)
      .select(['id', 'givenName', 'surname', 'displayName', 'mail'])
      .get();
    return Promise.all(
      response.value.map(async (user) => {
        const { givenName, surname, displayName, mail } = user;
        const fullName = `${givenName} ${surname} ${displayName} ${mail}`;
        if (fullName.toLowerCase().includes(value.toLowerCase())) {
          const fullUser = await this.getADUserByExternalId(user.id);
          const userFromDB = await this.getUserByExternalId(user.id);
          return { ...fullUser, ...userFromDB };
        }
      })
    ).then(async (users) => {
      // filter user in the current tenant
      const filterByTenant = await this.filterUsersByTenant(users, tenantId);
      return filterByTenant.filter((user) => user);
    });
  }

  async filterUsersByTenant(users: any[], tenantId: string) {
    return Promise.all(
      users.map(async (user, _index) => {
        if (user) {
          const userTenant = await this.userTenantRepository.findOne({
            where: {
              tenantId,
              userId: user.id,
            },
          });
          if (userTenant) {
            return user;
          }
        }
      })
    );
  }

  async getUsersById(id: string) {
    const response = await this.adClient.api(`/users/${id}`).get();
    return response;
  }

  async updateUser(data) {
    const { externalAuthSystemId, ...rest } = data;
    await this.adClient.api(`/users/${externalAuthSystemId}`).patch(rest); // success call will return 204 NO CONTENT

    return { ...data, id: externalAuthSystemId };
  }

  async deleteUser(data) {
    const { externalAuthSystemId } = data;
    await this.adClient.api(`/users/${externalAuthSystemId}`).delete(); // success call will return 204 NO CONTENT
    await this.userRepository.delete({ externalAuthSystemId });
    return true;
  }
  async deleteTenantUser(data) {
    const { externalAuthSystemId } = data;
    const currentTenantId = this.reqContextResolutionService.getTenantId();
    const userTenant = await this.userTenantRepository
      .createQueryBuilder('user_tenant')
      .innerJoinAndSelect('user_tenant.user', 'user')
      .innerJoinAndSelect('user_tenant.tenant', 'tenant')
      .innerJoinAndSelect('user_tenant.roles', 'role')
      .where('user.externalAuthSystemId = :externalAuthSystemId', {
        externalAuthSystemId,
      })
      .andWhere('user_tenant.tenantId = :currentTenantId', {
        currentTenantId,
      })
      .getOne();
    if (userTenant) {
      const { affected } = await this.userTenantRepository.delete({
        id: userTenant.id,
      });
      return affected > 0;
    }
    return false;
  }

  async getUserByInternalId(id: string) {
    return this.userRepository.findOne(id);
  }
}
