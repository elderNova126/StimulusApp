import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TenantService } from 'src/tenant/tenant.service';
import { JWTService } from './bcrypt/jwt.service';
import { TokenDto } from './bcrypt/token.dto';
import { CreateExternalSystemAuth } from './dto/externalSystemAuth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ApiKeyStatus, ExternalSystemAuth } from './entities/externalSystemAuth.entity';
import { ExternalSystemService } from './ExternalSystem.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly externalSystemService: ExternalSystemService,
    private readonly jwtService: JWTService,
    private tenantService: TenantService
  ) {}

  async createExternalSystemAuth(newExternalSystemAuth: CreateExternalSystemAuth) {
    const { tenantId } = newExternalSystemAuth;
    const tenant = await this.tenantService.getById(tenantId);
    if (!tenant) throw new UnauthorizedException();

    const authCredentials = await this.externalSystemService.create(newExternalSystemAuth);
    if (authCredentials) return authCredentials;
    throw new UnauthorizedException();
  }

  async updateExternalSystemAuth(updateExternalSystemAuth: ExternalSystemAuth) {
    const { id } = updateExternalSystemAuth;

    const apiKey = await this.externalSystemService.findByArgs({ id });
    if (!apiKey) throw new UnauthorizedException();
    const newData = {
      ...apiKey,
      ...updateExternalSystemAuth,
    };
    const results = await this.externalSystemService.update(newData);
    return results;
  }
  async removeExternalSystemAuth(removeExternalSystemAuth: ExternalSystemAuth) {
    try {
      const { id, tenantId } = removeExternalSystemAuth;

      const apiKey = await this.externalSystemService.findByArgs({ id, tenantId });
      if (!apiKey) throw new UnauthorizedException();

      await this.externalSystemService.delete(removeExternalSystemAuth);
      return { successful: true };
    } catch (error) {
      return { successful: false };
    }
  }

  async loginByApiKey(loginAuthDto: LoginAuthDto): Promise<TokenDto> {
    const authCredentials = await this.externalSystemService.findByApiKey(loginAuthDto.apiKey);
    if (authCredentials.status === ApiKeyStatus.INACTIVE) throw new UnauthorizedException('Authentication error');
    if (authCredentials) return this.jwtService.generateNewHash(authCredentials);
    throw new UnauthorizedException();
  }

  async validateToken(token: string): Promise<ExternalSystemAuth> {
    return this.jwtService.validateToken(token);
  }

  async validateApiKey(apiKey: string): Promise<ExternalSystemAuth> {
    const authCredentials = await this.externalSystemService.findByApiKey(apiKey);
    if (authCredentials) {
      if (authCredentials.status === ApiKeyStatus.INACTIVE) {
        throw new Error('Authentication error');
      } else {
        return authCredentials;
      }
    } else {
      throw new Error('Authentication error');
    }
  }

  async getExternalSystemAuthByTenantId(tenantId: string): Promise<any> {
    const apiKeys = await this.externalSystemService.findByArgs({ tenantId });
    return { results: apiKeys ?? [], count: apiKeys.length };
  }
}
