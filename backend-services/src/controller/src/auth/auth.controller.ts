import { Body, Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { LoggingInterceptor } from 'src/logging/logger.interceptor';
import { AuthService } from './auth.service';
import { TokenDto } from './bcrypt/token.dto';
import { ExternalSystemByTenant } from './dto/externalSystemAuth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ExternalSystemAuth } from './entities/externalSystemAuth.entity';

@Controller('auth')
@UseInterceptors(LoggingInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('DataService', 'NewExternalSystemAuth')
  newExternalSystemAuth(@Body() newExternalSystem: ExternalSystemAuth) {
    return this.authService.createExternalSystemAuth(newExternalSystem);
  }

  @GrpcMethod('DataService', 'UpdateExternalSystemAuth')
  updateExternalSystemAuth(@Body() updateExternalSystem: ExternalSystemAuth) {
    return this.authService.updateExternalSystemAuth(updateExternalSystem);
  }

  @GrpcMethod('DataService', 'RemoveExternalSystemAuth')
  removeExternalSystemAuth(@Body() removeExternalSystem: ExternalSystemAuth) {
    return this.authService.removeExternalSystemAuth(removeExternalSystem);
  }

  @GrpcMethod('DataService', 'GetAuthenticationByToken')
  async getAuthenticationByToken(@Body() tokenDto: TokenDto): Promise<ExternalSystemAuth> {
    const result: any = await this.authService.validateToken(tokenDto.token);
    const authCredentials: ExternalSystemAuth = result.authCredentials;
    return await this.authService.validateApiKey(authCredentials.apiKey);
  }

  @GrpcMethod('DataService', 'LoginByApiKey')
  async loginByApiKey(@Body() loginAuthDto: LoginAuthDto): Promise<TokenDto> {
    return await this.authService.loginByApiKey(loginAuthDto);
  }

  @GrpcMethod('DataService', 'GetApiKeys')
  async getApiKeys(@Body() args: ExternalSystemByTenant): Promise<any> {
    return await this.authService.getExternalSystemAuthByTenantId(args.tenantId);
  }
}
