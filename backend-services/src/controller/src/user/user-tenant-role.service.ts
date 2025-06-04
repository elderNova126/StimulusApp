import { Inject, Injectable } from '@nestjs/common';
import { IPaginationDTO } from 'src/shared/pagination.interface';
import { Connection, Repository } from 'typeorm';
import { GLOBAL_CONNECTION } from '../database/database.constants';
import { ProvisionStatus, Tenant } from '../tenant/tenant.entity';
import { AdminUserDefault } from './constants';
import { Role, UserRole } from './role.entity';
import { UserManagementList, UserTenant } from './user-tenant.entity';
import { User } from './user.entity';

@Injectable()
export class UserTenantRoleService {
  private readonly utRepository: Repository<UserTenant>;
  private readonly userRepository: Repository<User>;
  private readonly tenantRepository: Repository<Tenant>;
  private readonly roleRepository: Repository<Role>;
  constructor(@Inject(GLOBAL_CONNECTION) connection: Connection) {
    this.utRepository = connection.getRepository(UserTenant);
    this.userRepository = connection.getRepository(User);
    this.tenantRepository = connection.getRepository(Tenant);
    this.roleRepository = connection.getRepository(Role);
  }

  async getUserTenants(externalAuthSystemId: string) {
    const user = await this.userRepository.findOneOrFail({
      externalAuthSystemId,
    });
    if (user.globalAdmin) {
      const tenants = await this.tenantRepository.find({
        relations: ['tenantCompany'],
        where: {
          provisionStatus: ProvisionStatus.PROVISIONED,
        },
      });
      const hasStimulusTenant = tenants.some((t) => t.name === 'Stimulus');
      return tenants.map((tenant, index) => ({
        isDefault: hasStimulusTenant ? tenant.name === 'Stimulus' : index === 0,
        ...tenant,
      }));
    }
    const userTenantsRoles = await this.utRepository
      .createQueryBuilder('user_tenant')
      .innerJoinAndSelect('user_tenant.user', 'user')
      .leftJoinAndSelect('user_tenant.tenant', 'tenant')
      .leftJoinAndSelect('tenant.tenantCompany', 'tenantCompany')
      .where('user.id = :userId', {
        userId: user.id,
      })
      // TODO add this when user invitation approval mechanism is built
      // .andWhere('user_tenant.approved = true')
      .getMany();
    return userTenantsRoles.map((utrItem) => {
      return {
        isDefault: utrItem.isDefault,
        ...utrItem.tenant,
      };
    });
  }

  async getUserTenantRoles(externalAuthSystemId: string, tenantId?: string) {
    const user = await this.userRepository.findOneOrFail({
      externalAuthSystemId,
    });
    if (user.globalAdmin) {
      let tenant;
      if (tenantId) {
        tenant = await this.tenantRepository.findOne({
          where: { id: tenantId },
          relations: ['tenantCompany'],
          order: {
            created: 'DESC',
          },
        });
      }

      const roles = await this.roleRepository.find({
        where: { name: UserRole.SUPERADMIN },
      });
      return {
        tenant,
        roles,
        global: true,
      };
    }

    const userTenant = await this.utRepository
      .createQueryBuilder('user_tenant')
      .innerJoinAndSelect('user_tenant.user', 'user')
      .innerJoinAndSelect('user_tenant.tenant', 'tenant')
      .leftJoinAndSelect('tenant.tenantCompany', 'tenantCompany')
      .innerJoinAndSelect('user_tenant.roles', 'role')
      .where('user.id = :userId', {
        userId: user.id,
      })
      .andWhere('user_tenant.tenantId = :tenantId', { tenantId })
      .getOne();
    const { tenant, roles } = userTenant || {};
    return {
      tenant,
      roles,
    };
  }

  async getTenantUsers(tenantId: string, pagination: IPaginationDTO, typeOfList: string) {
    const { limit = 15, page = 1 } = pagination ?? {};

    const res = await this.utRepository
      .createQueryBuilder('user_tenant')
      .innerJoin('user_tenant.tenant', 'tenant')
      .leftJoinAndSelect('user_tenant.roles', 'role')
      .leftJoinAndSelect('user_tenant.user', 'user')
      .where('tenant.id = :tenantId', {
        tenantId,
      })
      .andWhere('role.internal = :internal', { internal: false });
    if (typeOfList === UserManagementList.PENDING) {
      res.andWhere('user.externalAuthSystemId IS NULL');
    } else {
      res.andWhere('user.externalAuthSystemId IS NOT NULL');
    }

    res.take(limit).skip(limit * (page - 1));

    const users = await res.getManyAndCount();

    return {
      users: users[0].map(({ user }) => user),
      count: users[1],
    };
  }

  async getAdminTenant(tenantId: string): Promise<UserTenant> {
    const res = await this.utRepository
      .createQueryBuilder('user_tenant')
      .innerJoin('user_tenant.tenant', 'tenant')
      .leftJoinAndSelect('user_tenant.roles', 'role')
      .leftJoinAndSelect('user_tenant.user', 'user')
      .where('tenant.id = :tenantId', {
        tenantId,
      })
      .andWhere('user.email = :email', { email: AdminUserDefault.email })
      .getOne();

    return res;
  }
}
