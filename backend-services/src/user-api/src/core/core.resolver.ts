import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Mutation, Resolver } from '@nestjs/graphql';
import { TenantScopeGuard } from 'src/auth/tenant-scope.guard';
import { GlobalAdminScopeGuard } from '../auth/global-admin-scope.guard';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { ScopeContextGuard } from '../auth/scope-context.guard';
import { GqlLoggingInterceptor } from '../logging/gql-logging.interceptor';
import { CoreService } from './core.service';

@Resolver()
@UseInterceptors(GqlLoggingInterceptor)
export class CoreResolver {
  constructor(private coreService: CoreService) {}

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, GlobalAdminScopeGuard, TenantScopeGuard)
  async migrateTenant() {
    const res = await this.coreService.migrateTenant();
    return res && res.synchronized;
  }

  @Mutation(() => Boolean)
  @UseGuards()
  async reverseLastMigrationTenant() {
    const res = await this.coreService.reverseLastMigrationTenant();
    return res && res.synchronized;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, GlobalAdminScopeGuard)
  async migrateGlobal() {
    const res = await this.coreService.migrateGlobal();
    return res && res.synchronized;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, GlobalAdminScopeGuard)
  async updateAndReRunIndex() {
    const res = await this.coreService.UpdateAndReRunIndex();
    return res && res.synchronized;
  }
}
