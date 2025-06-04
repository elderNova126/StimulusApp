import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ContextProviderService } from '../core/context-provider.service';
import { ControllerGrpcClientService } from '../core/controller-client-grpc.service';
import { ProtoServices, ServicesMapping } from '../core/proto.constants';
import { ScopeContext } from '../core/scope-context.class';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { BaseEntity, ChangeStatusApiKeyArgs, CreateApiKeyArgs } from './dto/apikeyArgs';
import { TopicCategoryArgs, UserNotificationArgs, UserProfileArgs } from './dto/userProfileArgs';

@Injectable()
export class AuthService {
  private readonly dataServiceMethods;
  constructor(
    @Inject(ServicesMapping[ProtoServices.DATA])
    private readonly controllerGrpcClientDataService: ControllerGrpcClientService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly logger: StimulusLogger,
    private readonly contextProviderService: ContextProviderService
  ) {
    this.dataServiceMethods = controllerGrpcClientDataService.serviceMethods;
    this.logger.context = AuthService.name;
  }

  async getUser(externalAuthSystemId: string) {
    const response = await this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.getUsersByExternalIds,
      { externalAuthSystemIds: [externalAuthSystemId] }
    );

    if (response.error) return response;
    return response?.results?.[0];
  }

  updateUserProfile(userProfileArgs: UserProfileArgs) {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.updateUser, userProfileArgs);
  }

  getUserSettings(userProfileArgs: UserProfileArgs): Promise<string> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.getUserSettings, userProfileArgs);
  }

  async getAllTenants(): Promise<Record<string, any>> {
    const result = await this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.getAllTenants,
      null
    );

    return result.tenants || [];
  }

  async getUserAccount() {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.getUserAccount, {});
  }

  async getUserTenantRoles(body): Promise<Record<string, any>> {
    const result = await this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.getUserTenantRoles,
      body
    );

    return result.roles || [];
  }

  async issueScopeContextToken(externalAuthSystemId: string, tenantId?: string): Promise<Record<string, any>> {
    const { tenant, roles, global } = await this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.getUserTenantRoles,
      {
        externalAuthSystemId,
        tenantId,
      }
    );

    if (global) {
      const token = this.jwtService.sign({
        tenantId: tenant ? tenant.id : undefined,
        tenantName: tenant ? tenant.name : undefined,
        tenantCompanyEin: tenant && tenant.tenantCompany ? tenant.tenantCompany.ein : undefined,
        roles,
        global,
      } as ScopeContext);

      return { token };
    }

    if (!global && tenant && roles.length > 0) {
      const token = this.jwtService.sign({
        tenantId: tenant.id,
        tenantName: tenant.name,
        tenantCompanyEin: tenant.tenantCompany ? tenant.tenantCompany.ein : undefined,
        roles,
      } as ScopeContext);

      return { token };
    }

    throw new UnauthorizedException('The selected role is unavailable to the user on this tenant.');
  }

  async validateExternalAccessUser(username: string, password: string): Promise<boolean> {
    const externalAccessUserName = this.configService.get<string>('EXTERNAL_ACCESS_USER_USERNAME');
    const externalAccessUserPasswordHash = this.configService.get<string>('EXTERNAL_ACCESS_USER_PASSWORD_HASH');
    let externalAccessUserValid = false;
    if (username === externalAccessUserName) {
      this.logger.log(`External access user username valid`);
      externalAccessUserValid = await bcrypt.compare(password, externalAccessUserPasswordHash);
      this.logger.log(`External access user password ${externalAccessUserValid ? 'valid' : 'invalid'}`);
    } else {
      this.logger.warn(`External access user username invalid`);
    }
    return externalAccessUserValid;
  }

  async createUser(externalAuthSystemId: string, email: string) {
    try {
      if (externalAuthSystemId) {
        const createdUser = await this.controllerGrpcClientDataService.callProcedure(
          this.dataServiceMethods.createUser,
          {
            user: { externalAuthSystemId, email },
          }
        );
        this.logger.log(JSON.stringify(createdUser));
      } else {
        this.logger.warn('Missing externalAuthSystemId');
      }
    } catch (err) {
      this.logger.error(err);
    }
  }

  deleteUser(externalAuthSystemId: string) {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.deleteUser, {
      externalAuthSystemId,
    });
  }

  deleteTenantUser(externalAuthSystemId: string) {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.deleteTenantUser, {
      externalAuthSystemId,
    });
  }

  requestAccess(user: UserProfileArgs) {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.requestAccess, {
      ...user,
    });
  }

  async getTenantUsers(
    tenantId: string,
    page: number,
    limit: number,
    typeOfList: string
  ): Promise<Record<string, any>> {
    const pagination = { page, limit };

    const { results, count } = await this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.getTenantUsers,
      { tenantId, pagination, typeOfList }
    );

    return { results, count } || { results: [], count: 0 };
  }

  async getTenantMyUsers(tenantId: string, externalAuthSystemId: string): Promise<Record<string, any>> {
    const { results } = await this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.getTenantUsers,
      { tenantId }
    );
    const myUsers = results.filter((user) => user.externalAuthSystemId === externalAuthSystemId) || [];
    return myUsers;
  }
  async getUserByExternalAuthId(externalAuthSystemIds: string[]) {
    const { results } = await this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.getUsersByExternalIds,
      { externalAuthSystemIds }
    );

    return results;
  }

  getUserByInternalId(id: string) {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.getUserByInternalId, { id });
  }

  getNotificationProfile(userId: string) {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.getUserNotificationProfile, {
      userId,
    });
  }

  subscribeToCategoryTopic(args: TopicCategoryArgs) {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.subscribeToCategoryTopic, args);
  }

  unsubscribeFromCategoryTopic(args: TopicCategoryArgs) {
    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.unsubscribeFromCategoryTopic,
      args
    );
  }

  subscribeToTopic(args: UserNotificationArgs) {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.subscribeToTopic, args);
  }

  unsubscribeFromTopic(args: UserNotificationArgs) {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.unsubscribeFromTopic, args);
  }

  async inviteTenantUser(email: string, resend: boolean) {
    try {
      return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.provisionTenantUser, {
        email,
        resend,
      });
    } catch (e) {
      this.logger.error(e);
      return {
        done: false,
        error: e,
      };
    }
  }

  getUserByNameAndSurname(args: UserProfileArgs) {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.getUserByNameAndSurname, args);
  }

  getUserById(args: UserProfileArgs) {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.getUserById, args);
  }

  async getApiKeys() {
    const { tenantId } = this.contextProviderService.getScopeContext();
    const args = { tenantId };
    const result = await this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.getApiKeys, args);

    return result.results ? result : { results: [], count: 0 };
  }

  async createNewApiKey(args: CreateApiKeyArgs) {
    const { tenantId } = this.contextProviderService.getScopeContext();
    const { sub } = this.contextProviderService.getUserContext();

    const result = await this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.newExternalSystemAuth,
      { ...args, userId: sub, tenantId }
    );

    return result;
  }

  async updateApiKey(args: ChangeStatusApiKeyArgs) {
    const { tenantId } = this.contextProviderService.getScopeContext();
    const result = await this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.updateExternalSystemAuth,
      { ...args, tenantId }
    );

    return result ?? {};
  }

  async deleteApiKey(args: BaseEntity) {
    const { tenantId } = this.contextProviderService.getScopeContext();
    const result = await this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.removeExternalSystemAuth,
      { ...args, tenantId }
    );

    return result ?? {};
  }
}
