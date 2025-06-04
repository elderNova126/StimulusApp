import { Inject, Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { Role } from './role.entity';
import { GLOBAL_CONNECTION } from '../database/database.constants';

@Injectable()
export class RoleService {
  private readonly roleRepository: Repository<Role>;
  constructor(@Inject(GLOBAL_CONNECTION) connection: Connection) {
    this.roleRepository = connection.getRepository(Role);
  }

  async getRoles(): Promise<any> {
    const roles = await this.roleRepository.find();

    return roles;
  }
}
