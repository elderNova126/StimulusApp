import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [AssetService],
  controllers: [AssetController],
})
export class AssetModule {}
