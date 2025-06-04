import { Controller, UseInterceptors, UseFilters } from '@nestjs/common';
import { BadgeService } from './badge.service';
import { GrpcMethod } from '@nestjs/microservices';
import { Badge } from './badge.entity';
import { LoggingInterceptor } from '../logging/logger.interceptor';
import { GrpcExceptionFilter } from '../shared/utils-grpc/grpc-exception-filter';
import { controller } from 'controller-proto/codegen/tenant_pb';
import { BadgeTenantRelationship } from './badgeTenantRelationship.entity';

@Controller('badge')
@UseFilters(GrpcExceptionFilter)
@UseInterceptors(LoggingInterceptor)
export class BadgeController {
  constructor(private badgeService: BadgeService) {}

  @GrpcMethod('DataService', 'SearchBadges')
  async searchBadges(): Promise<{ results: Badge[]; count: number }> {
    const [results, count] = await this.badgeService.getBadges();

    return { results, count };
  }

  @GrpcMethod('DataService', 'CreateBadge')
  async createBadge(data: any): Promise<Badge> {
    const { badge } = data;
    return this.badgeService.createBadge(badge);
  }

  @GrpcMethod('DataService', 'DeleteBadge')
  async deleteBadge(data: controller.DeleteBadgeRequestPayload): Promise<any> {
    const res = await this.badgeService.deleteBadge(data.id);

    return { done: res.affected > 0 };
  }

  @GrpcMethod('DataService', 'UpdateBadge')
  async updateBadge(data: any): Promise<Badge> {
    const { badge: badgeData } = data;
    const { id, ...badge } = badgeData;

    return this.badgeService.updateBadge(id, badge);
  }

  @GrpcMethod('DataService', 'CreateBadgeTenantRelationship')
  async createBadgeTenantRelationship(data: any): Promise<BadgeTenantRelationship> {
    const { badgeTenantCompanyRelationship: badgeTenantData } = data;
    const response = await this.badgeService.createBadgeTenantRelationship(badgeTenantData);

    return response;
  }

  @GrpcMethod('DataService', 'DeleteBadgeTenantRelationships')
  async deleteBadgeTenantRelationships(data: controller.DeleteBadgeTenantRelationshipsRequestPayload): Promise<any> {
    const res = await this.badgeService.deleteBadgeTenantRelationships(data.ids);

    return { done: res.affected > 0 };
  }

  @GrpcMethod('DataService', 'UpdateBadgeTenantRelationship')
  async updateBadgeTenantRelationship(data: any): Promise<BadgeTenantRelationship> {
    const { badgeTenantCompanyRelationship: badgeTenantData } = data;
    const response = await this.badgeService.updateBadgeTenantRelationship(badgeTenantData);

    return response;
  }
}
