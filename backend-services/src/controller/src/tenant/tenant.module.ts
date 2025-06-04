import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [TenantService],
  controllers: [TenantController],
})
export class TenantModule {}
