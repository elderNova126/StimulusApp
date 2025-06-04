import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { Asset } from './asset.entity';
import { AssetService } from './asset.service';

@Controller('asset')
export class AssetController {
  constructor(
    private assetService: AssetService,
    private readonly logger: StimulusLogger
  ) {
    this.logger.context = AssetController.name;
  }

  @GrpcMethod('DataService', 'CreateAsset')
  createAsset(data: any): Promise<any> {
    return this.assetService.createAsset(data.assetPayload);
  }

  @GrpcMethod('DataService', 'DeleteAsset')
  async deleteAsset(data: any): Promise<any> {
    const { id, userId } = data;

    await this.assetService.deleteAsset(id, userId);
    return { done: true };
  }

  @GrpcMethod('DataService', 'UpdateAsset')
  updateAsset(data: any): Promise<Asset> {
    const {
      asset: { id, ...asset },
      userId,
    } = data;

    return this.assetService.updateAsset(id, asset, userId);
  }

  @GrpcMethod('DataService', 'GetAssets')
  async searchAsset(data: any) {
    const { assetPayload } = data;

    const [results, count] = await this.assetService.getAssets({ ...assetPayload });
    return { results, count };
  }
}
