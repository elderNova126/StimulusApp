import { Module } from '@nestjs/common';
import { AssetResolver } from './asset.resolver';
import { AssetService } from './asset.service';
import { AzureStorageCredentialModule } from '../azure-storage-credential/azure-storage-credential.module';
import { AssetController } from './asset.controller';

@Module({
  imports: [AzureStorageCredentialModule],
  providers: [AssetResolver, AssetService],
  controllers: [AssetController],
})
export class AssetModule {}
