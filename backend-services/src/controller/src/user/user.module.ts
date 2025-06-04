import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserTenantRoleService } from './user-tenant-role.service';
import { RoleService } from './role.service';
import { UserEmailService } from './user-email.service';

@Module({
  imports: [],
  providers: [UserService, UserTenantRoleService, RoleService, UserEmailService],
  controllers: [UserController],
  exports: [UserTenantRoleService, UserService],
})
export class UserModule {}
