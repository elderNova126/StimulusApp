import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import { GLOBAL_CONNECTION } from 'src/database/database.constants';
import { Connection, Repository } from 'typeorm';
import { CreateExternalSystemAuth, ExternalSystemAuth } from './dto/externalSystemAuth.dto';
import { ApiKeyStatus, ExternalSystemAuth as ExternalSystemEntity } from './entities/externalSystemAuth.entity';
import crypto from 'crypto';
@Injectable()
export class ExternalSystemService {
  private readonly externalSystemAuth: Repository<ExternalSystemEntity>;
  constructor(@Inject(GLOBAL_CONNECTION) connection: Connection) {
    this.externalSystemAuth = connection.getRepository(ExternalSystemEntity);
  }

  public async create(externalSystemAuth: CreateExternalSystemAuth) {
    try {
      const newCredentials: ExternalSystemAuth = {
        status: ApiKeyStatus.ACTIVE,
        apiKey: this.generateNewHash(),
        expire: externalSystemAuth.expire ?? null,
        tenantId: externalSystemAuth.tenantId,
        name: externalSystemAuth.name ?? null,
        userId: externalSystemAuth.userId,
      };
      const authCredentials = await this.externalSystemAuth.save(newCredentials);
      return authCredentials;
    } catch (err) {
      throw err;
    }
  }
  public async update(externalSystemAuth: ExternalSystemAuth) {
    try {
      const authCredentials = await this.externalSystemAuth.save(externalSystemAuth);
      return await this.externalSystemAuth.findOne({ where: { id: authCredentials.id } });
    } catch (err) {
      throw err;
    }
  }
  public async delete(externalSystemAuth: ExternalSystemAuth) {
    try {
      await this.externalSystemAuth.delete({ id: externalSystemAuth.id });
      return;
    } catch (err) {
      throw err;
    }
  }

  public async findByApiKey(apiKey: string) {
    const authCredentials = await this.externalSystemAuth.findOne({ where: { apiKey } });
    return authCredentials;
  }

  public async findByArgs(args: any) {
    const authCredentials = await this.externalSystemAuth.find({ where: { ...args } });
    return authCredentials;
  }

  public async disableExternalAuthentication(id: string) {
    const disabledAuthentication = await this.externalSystemAuth.update(id, { status: ApiKeyStatus.INACTIVE });
    return disabledAuthentication;
  }

  private generateNewHash() {
    const bytes = crypto.randomBytes(8);
    const hash = crypto.createHash('sha256').update(bytes).digest('hex').substring(0, 32);

    return hash;
  }
}
