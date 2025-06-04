import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtTenantConfig } from './jwt-tenant.config';
import { AuthController } from './auth.controller';
import { ExternalBasicStrategy } from './external-basic.strategy';
import { ScopeContextStrategy } from './scope-context.strategy';

@Module({
  controllers: [AuthController],
  imports: [PassportModule.register({ session: false }), JwtModule.registerAsync({ useClass: JwtTenantConfig })],
  providers: [JwtStrategy, AuthResolver, AuthService, ExternalBasicStrategy, ScopeContextStrategy],
  exports: [AuthService],
})
export class AuthModule {}
