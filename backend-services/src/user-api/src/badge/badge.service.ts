import { Injectable, Inject } from '@nestjs/common';
import { DeleteBadgeArgs, DeleteBadgeRelationsArgs } from '../dto/deleteArgs';
import { ActionResponseUnion, BaseResponse } from '../models/baseResponse';
import { ProtoServices, ServicesMapping } from '../core/proto.constants';
import { ControllerGrpcClientService } from '../core/controller-client-grpc.service';
import { BadgeResponseUnion, BadgeUnion, BadgeTenantCompanyRelationshipUnion } from 'src/models/badge';
import { BadgeArgs, BadgeSearchArgs, BadgeTenantRelationshipArgs } from 'src/dto/badgeArgs';

@Injectable()
export class BadgeService {
  private readonly dataServiceMethods: any;
  constructor(
    @Inject(ServicesMapping[ProtoServices.DATA])
    private readonly controllerGrpcClientDataService: ControllerGrpcClientService
  ) {
    this.dataServiceMethods = this.controllerGrpcClientDataService.serviceMethods;
  }

  async searchBadges(badgeSearchArgs: BadgeSearchArgs): Promise<typeof BadgeResponseUnion> {
    const { query, ...badge } = badgeSearchArgs;
    const badgeSearchGrpcArgs: any = { query, badge };

    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.searchBadges,
      badgeSearchGrpcArgs
    );
  }

  createBadge(badgeArgs: BadgeArgs): Promise<typeof BadgeUnion> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.createBadge, {
      badge: badgeArgs,
    });
  }

  deleteBadge(badgeArgs: DeleteBadgeArgs): Promise<typeof ActionResponseUnion> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.deleteBadge, badgeArgs);
  }

  updateBadge(badgeArgs: BadgeArgs): Promise<typeof BadgeUnion> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.updateBadge, {
      badge: badgeArgs,
    });
  }

  createBadgeTenantRelationship(
    badgeTenantRelationshipArgs: BadgeTenantRelationshipArgs
  ): Promise<typeof BadgeTenantCompanyRelationshipUnion> {
    try {
      return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.createBadgeTenantRelationship, {
        badgeTenantCompanyRelationship: badgeTenantRelationshipArgs,
      });
    } catch (e) {
      console.log(e);
    }
  }

  updateBadgeTenantRelationship(
    badgeTenantRelationshipArgs: BadgeTenantRelationshipArgs
  ): Promise<typeof BadgeTenantCompanyRelationshipUnion> {
    try {
      return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.updateBadgeTenantRelationship, {
        badgeTenantCompanyRelationship: badgeTenantRelationshipArgs,
      });
    } catch (e) {
      console.log(e);
    }
  }

  deleteBadgeTenantRelationship(badgeTenantArgs: DeleteBadgeRelationsArgs): Promise<BaseResponse> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.deleteBadgeTenantRelationships, {
      ids: badgeTenantArgs.ids,
    });
  }
}
