import { Inject, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { GLOBAL_CONNECTION } from '../database/database.constants';
import { GrpcUnauthenticatedException } from '../shared/utils-grpc/exception';
import { User } from '../user/user.entity';
import { AssetRelation } from './asset-relation.entity';

import { Asset } from './asset.entity';

@Injectable()
export class AssetService {
  private readonly assetRepository: Repository<Asset>;
  private readonly assetRelationRepository: Repository<AssetRelation>;
  private readonly tenantEntityManager: EntityManager;
  private readonly userRepository: Repository<User>;

  constructor(@Inject(GLOBAL_CONNECTION) connection) {
    this.assetRelationRepository = connection.getRepository(AssetRelation);
    this.assetRepository = connection.getRepository(Asset);
    this.tenantEntityManager = connection.manager;
    this.userRepository = connection.getRepository(User);
  }

  async createAsset(assetData: any): Promise<AssetRelation> {
    const { company, user, asset: assetObj } = assetData;
    return (await this.tenantEntityManager.transaction(async (transactionalEntityManager) => {
      const userObj = await transactionalEntityManager.findOne(User, user);
      const assetCompany = await transactionalEntityManager.findOne(AssetRelation, {
        ...(company && { company }),
        ...(user && { user: userObj }),
      });
      if (assetCompany) assetObj.id = assetCompany.asset.id;
      const asset = await transactionalEntityManager.save(Asset, { ...assetObj });

      return transactionalEntityManager.save(AssetRelation, {
        ...(assetCompany && { id: assetCompany.id }),
        company,
        ...(user && { user: userObj }),
        asset,
      });
    })) as AssetRelation;
  }

  async deleteAsset(id: string, userId: string) {
    const assetToDelete = await this.assetRepository.findOneOrFail({ where: { id } });

    if (assetToDelete.createdBy !== userId) {
      throw new GrpcUnauthenticatedException('Insufficient permissions');
    }
    await this.assetRepository.remove(assetToDelete);
  }

  async updateAsset(id: string, assetData, userId) {
    const asset = await this.assetRepository.findOneOrFail({ where: { id } });
    if (!userId || asset.createdBy !== userId) {
      throw new GrpcUnauthenticatedException('Insufficient permissions');
    }
    return this.assetRelationRepository.save({ ...assetData });
  }

  async getAssets(filters: AssetRelation) {
    const { user } = filters;
    const userObj = user ? await this.userRepository.findOne(user) : null;
    if (userObj) filters.user = userObj;

    return this.assetRelationRepository.findAndCount({
      relations: ['company', 'user', 'asset'],
      where: filters,
    });
  }
}
