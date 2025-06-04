import { Module } from '@nestjs/common';
import { TenantService } from 'src/tenant/tenant.service';
import { UserEmailService } from 'src/user/user-email.service';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JWTService } from './bcrypt/jwt.service';
import { ExternalSystemService } from './ExternalSystem.service';

@Module({
  controllers: [AuthController],
  providers: [ExternalSystemService, JWTService, AuthService, UserService, UserEmailService, TenantService],
})
export class AuthModule {}
