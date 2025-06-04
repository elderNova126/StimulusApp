import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { controller } from 'controller-proto/codegen/tenant_pb';
import { LoggingInterceptor } from '../logging/logger.interceptor';
import { AdminUserDefault } from './constants';
import { UserTenantRoleService } from './user-tenant-role.service';
import { UserManagementList } from './user-tenant.entity';
import { UserService } from './user.service';
@Controller('User')
@UseInterceptors(LoggingInterceptor)
export class UserController {
  constructor(
    private userService: UserService,
    private utrService: UserTenantRoleService
  ) {}

  @GrpcMethod('DataService', 'GetUserSettings')
  async getUserSettings(data: any): Promise<any> {
    const { externalAuthSystemId } = data;

    return {
      settings: await this.userService.getUserSettings(externalAuthSystemId),
    };
  }

  @GrpcMethod('DataService', 'GetUserTenants')
  async getUserTenants(data: any): Promise<any> {
    const { externalAuthSystemId } = data;
    const userTenants = await this.utrService.getUserTenants(externalAuthSystemId);
    return { tenants: userTenants };
  }

  @GrpcMethod('DataService', 'GetTenantUsers')
  async getTenantUsers(data: any): Promise<any> {
    const { pagination, typeOfList, tenantId } = data;
    const { users, count } = await this.utrService.getTenantUsers(tenantId, pagination, typeOfList);
    let adUsers;
    if (count === 0) {
      return { results: [], count };
    }
    if (typeOfList !== UserManagementList.PENDING) {
      const userExternalIds = users
        .map(({ externalAuthSystemId }) => externalAuthSystemId)
        .filter((externalAuthSystemId) => externalAuthSystemId !== null);

      if (userExternalIds.length <= 0 && count === 0) {
        return { results: [], count };
      }
      adUsers = (
        await this.userService.getADUsersByExternalIds(userExternalIds, {
          select: [
            'id',
            'givenName',
            'surname',
            'mail',
            'jobTitle',
            'mobilePhone',
            'displayName',
            'businessPhones',
            'accountEnabled',
          ],
        })
      ).value;
    }

    const results = users.map((user) => ({
      ...adUsers?.find(({ id }) => id === user.externalAuthSystemId),
      ...user,
    }));

    return { results, count };
  }

  @GrpcMethod('DataService', 'GetUserTenantRoles')
  async getUserTenantRoles(data: any): Promise<any> {
    const { externalAuthSystemId, tenantId } = data;
    return this.utrService.getUserTenantRoles(externalAuthSystemId, tenantId);
  }

  @GrpcMethod('DataService', 'CreateUser')
  async createUser(createGlobalRequestPayload: controller.CreateGlobalRequestPayload): Promise<controller.IUser> {
    const { user } = createGlobalRequestPayload;
    return this.userService.provisionUser(user);
  }

  @GrpcMethod('DataService', 'ProvisionTenantUser')
  async provisionTenantUser(
    provisionTenantUserRequestPayload: controller.ProvisionTenantUserRequestPayload
  ): Promise<controller.IUser> {
    const { email, resend } = provisionTenantUserRequestPayload;
    return this.userService.provisionTenantUser(email, resend);
  }

  @GrpcMethod('DataService', 'RequestAccess')
  async requestAccess(userRequest: controller.UserRequest): Promise<controller.UserAccessResponse> {
    const success = await this.userService.requestAccess(userRequest);
    return new controller.UserAccessResponse({
      success,
    });
  }

  @GrpcMethod('DataService', 'GetUsersByExternalIds')
  async getUsersByExternalIds(data: any): Promise<any> {
    const { value: results } = await this.userService.getADUsersByExternalIds(data.externalAuthSystemIds);

    return { results };
  }

  @GrpcMethod('DataService', 'UpdateUser')
  updateUser(data: any): Promise<any> {
    return this.userService.updateUser(data);
  }

  @GrpcMethod('DataService', 'DeleteUser')
  async deleteUser(data: any): Promise<any> {
    return { done: await this.userService.deleteUser(data) };
  }

  @GrpcMethod('DataService', 'DeleteTenantUser')
  async deleteTenantUser(data: any): Promise<any> {
    return { done: await this.userService.deleteTenantUser(data) };
  }

  @GrpcMethod('DataService', 'GetUserByInternalId')
  async getUserByInternalId(data: any): Promise<any> {
    const user = await this.userService.getUserByInternalId(data.id);
    if (!user.externalAuthSystemId) {
      return {
        ...user,
        givenName: AdminUserDefault.givenName,
        surname: AdminUserDefault.surname,
        mail: AdminUserDefault.email,
      };
    }
    const {
      value: [adUser],
    } = await this.userService.getADUsersByExternalIds([user.externalAuthSystemId], {
      select: [
        'id',
        'givenName',
        'surname',
        'mail',
        'jobTitle',
        'mobilePhone',
        'displayName',
        'businessPhones',
        'accountEnabled',
      ],
    });

    return { ...user, ...adUser };
  }

  @GrpcMethod('DataService', 'GetUserByNameAndSurname')
  async getUserByNameAndSurname(data: any): Promise<any> {
    const value = await this.userService.getUsersByNameAndSurname(data.surname, {
      select: [
        'id',
        'givenName',
        'surname',
        'mail',
        'jobTitle',
        'mobilePhone',
        'displayName',
        'businessPhones',
        'accountEnabled',
      ],
    });
    return { results: value, count: value.length };
  }

  @GrpcMethod('DataService', 'GetUserById')
  async getUserById(data: any): Promise<any> {
    const response = await this.userService.getUsersById(data.externalAuthSystemId);
    return response ? response : null;
  }
}
