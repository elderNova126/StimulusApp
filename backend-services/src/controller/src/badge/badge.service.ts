import { Injectable, Scope, Inject } from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import { Badge, BadgeStatus } from './badge.entity';
import { GLOBAL_CONNECTION } from '../database/database.constants';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { ReqContextResolutionService } from 'src/core/req-context-resolution.service';
import { BadgeTenantRelationship } from './badgeTenantRelationship.entity';
import { GrpcAlreadyExistException, GrpcException } from 'src/shared/utils-grpc/exception';
import { ExceptionMessages } from 'src/utils/Exceptions';

@Injectable({ scope: Scope.REQUEST })
export class BadgeService {
  private readonly badgeRepository: Repository<Badge>;
  private readonly badgeTenantCompanyRelationshipRepository: Repository<BadgeTenantRelationship>;

  constructor(
    @Inject(GLOBAL_CONNECTION) connection,
    protected readonly logger: StimulusLogger,
    private readonly reqContextResolutionService: ReqContextResolutionService
  ) {
    this.badgeRepository = connection.getRepository(Badge);
    this.badgeTenantCompanyRelationshipRepository = connection.getRepository(BadgeTenantRelationship);
  }

  async getBadges() {
    const tenantId = this.reqContextResolutionService.getTenantId();
    try {
      const response = await this.badgeRepository.findAndCount({
        relations: ['tenant', 'badgeTenantCompanyRelationships'],
        where: { tenant: { id: tenantId } },
      });
      return response;
    } catch (e) {
      throw new GrpcException(e?.code, e);
    }
  }

  async getBadgeByTenantRelationshipId(id: string) {
    const tenantId = this.reqContextResolutionService.getTenantId();
    try {
      const response = await this.badgeRepository.findAndCount({
        relations: ['tenant', 'badgeTenantCompanyRelationships'],
        where: { tenant: { id: tenantId }, badgeTenantCompanyRelationships: { id } },
      });

      return response;
    } catch (e) {
      throw new GrpcException(e?.code, e);
    }
  }

  async createBadge(badgeData: Badge): Promise<Badge> {
    const tenantId = this.reqContextResolutionService.getTenantId();
    const checkBadge = await this.badgeRepository?.findAndCount({
      where: {
        tenantId,
        badgeName: badgeData.badgeName,
      },
    });
    if (checkBadge[1] === 0) {
      const response = await this.badgeRepository.save({
        ...badgeData,
        tenantId,
      });
      return response;
    } else {
      throw new GrpcAlreadyExistException(ExceptionMessages.BADGE_NAME_ALREADY_EXISTS);
    }
  }

  async updateBadge(id: string, badgeData: Badge): Promise<Badge> {
    const tenantId = this.reqContextResolutionService.getTenantId();
    const badgeToUpdate = await this.badgeRepository.findOneOrFail({
      relations: ['tenant', 'badgeTenantCompanyRelationships'],
      where: { id },
    });

    if (badgeToUpdate) {
      if (tenantId === badgeToUpdate?.tenant.id) {
        if (
          (badgeToUpdate.badgeDateStatus === BadgeStatus.MANDATORY ||
            badgeToUpdate.badgeDateStatus === BadgeStatus.OPTIONAL) &&
          badgeData.badgeDateStatus === BadgeStatus.HIDDEN
        ) {
          await Promise.all(
            badgeToUpdate.badgeTenantCompanyRelationships.map(async (relationship) => {
              relationship.badgeDate = null;
              await this.badgeTenantCompanyRelationshipRepository.save(relationship);
            })
          );
        }

        await this.badgeRepository.save({
          ...badgeData,
          badgeDateLabel: badgeData.badgeDateStatus === BadgeStatus.HIDDEN ? null : badgeData.badgeDateLabel,
          id,
        });

        const result = { ...badgeToUpdate, ...badgeData };
        return result as Badge;
      }
    }
  }

  async deleteBadge(id: string): Promise<DeleteResult> {
    const tenantId = this.reqContextResolutionService.getTenantId();
    const badgeToDelete = await this.badgeRepository.findOneOrFail({
      relations: ['tenant', 'badgeTenantCompanyRelationships'],
      where: { id },
    });

    if (badgeToDelete.tenant.id === tenantId) {
      return this.badgeRepository.delete({ id });
    }
  }

  async createBadgeTenantRelationship(data: BadgeTenantRelationship): Promise<BadgeTenantRelationship> {
    const { badgeId, tenantCompanyRelationshipId, badgeDate } = data;
    try {
      const badgeTenantRelationship = this.badgeTenantCompanyRelationshipRepository.create({
        badgeId,
        tenantCompanyRelationshipId,
        badgeDate,
      });

      const response = await this.badgeTenantCompanyRelationshipRepository.save(badgeTenantRelationship);
      return response;
    } catch (e) {
      throw new GrpcException(e?.code, e);
    }
  }

  async updateBadgeTenantRelationship(data: BadgeTenantRelationship): Promise<BadgeTenantRelationship> {
    const { id, ...badgeData } = data as any;
    const badgeToUpdate = await this.badgeTenantCompanyRelationshipRepository.findOneOrFail({
      where: { id },
    });

    if (badgeToUpdate) {
      await this.badgeTenantCompanyRelationshipRepository.save({
        ...badgeData,
        badgeDate: badgeData.badgeDate === '' ? null : badgeData.badgeDate,
        id,
      });

      const result = { ...badgeToUpdate, ...badgeData };
      return result as BadgeTenantRelationship;
    }
  }

  async deleteBadgeTenantRelationships(ids: string[]): Promise<DeleteResult> {
    const deletionPromises = ids.map(async (id) => {
      const response = await this.badgeTenantCompanyRelationshipRepository.delete({ id });
      return response;
    });

    const response = await Promise.all(deletionPromises);

    const result: DeleteResult = {
      affected: response[0].affected,
      raw: null,
    };

    return result;
  }
}
