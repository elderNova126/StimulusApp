import { Inject, Injectable } from '@nestjs/common';
import { StimulusLogger } from 'src/logging/stimulus-logger.service';
import { Connection, In, Repository } from 'typeorm';
import { Company } from '../company/company.entity';
import { ReqContextResolutionService } from '../core/req-context-resolution.service';
import { GLOBAL_CONNECTION, TENANT_CONNECTION } from '../database/database.constants';
import { CollaborationStatus } from '../project-collaboration/project-collaboration.entity';
import { Project } from '../project/project.entity';
import { ProjectCompany } from '../project/projectCompany.entity';
import { TenantCompanyRelationship } from '../tenant-company-relationship/tenant-company-relationship.entity';
import { UserTenant } from '../user/user-tenant.entity';
import { User } from '../user/user.entity';
import { UserProfile } from './user-profile.entity';

export enum NotificationCategory {
  GLOBAL = 'GLOBAL',
  PROJECTS = 'PROJECTS',
  PROJECT_COMPANIES = 'PROJECT_COMPANIES',
  FAVORITE_COMPANIES = 'FAVORITE_COMPANIES',
}
@Injectable()
export class UserProfileService {
  private readonly userProfileRepository: Repository<UserProfile>;
  private readonly companyRepository: Repository<Company>;
  private readonly projectRepository: Repository<Project>;
  private readonly utRepository: Repository<UserTenant>;
  private readonly userRepository: Repository<User>;

  constructor(
    private readonly reqContextResolutionService: ReqContextResolutionService,
    @Inject(TENANT_CONNECTION) tenantConnection: Connection,
    @Inject(GLOBAL_CONNECTION) globalConnection: Connection,
    private logger: StimulusLogger
  ) {
    this.userProfileRepository = tenantConnection.getRepository(UserProfile);
    this.companyRepository = globalConnection.getRepository(Company);
    this.projectRepository = tenantConnection.getRepository(Project);
    this.utRepository = globalConnection.getRepository(UserTenant);
    this.userRepository = globalConnection.getRepository(User);
  }

  private assignTopicToUserProfile(
    subscriptionData: { projectIds?: string[]; companyIds?: string[]; projectCompanyIds?: string[] },
    userProfile: UserProfile
  ): UserProfile {
    const { projectIds, companyIds, projectCompanyIds } = subscriptionData;

    if (projectIds?.length) {
      userProfile.subscribedProjects = [
        ...new Set([...userProfile.subscribedProjects, ...projectIds.map((id) => `${id}`)]),
      ];
    }
    if (companyIds?.length) {
      userProfile.subscribedCompanies = [...new Set([...userProfile.subscribedCompanies, ...companyIds])];
    }
    if (projectCompanyIds?.length) {
      userProfile.subscribedProjectCompanies = [
        ...new Set([...userProfile.subscribedProjectCompanies, ...projectCompanyIds]),
      ];
    }

    return userProfile;
  }

  private removeTopicFromUserProfile(
    subscriptionData: { projectIds?: string[]; companyIds?: string[]; projectCompanyIds?: string[] },
    userProfile: UserProfile
  ): UserProfile {
    const { projectIds, companyIds, projectCompanyIds } = subscriptionData;

    if (projectIds?.length) {
      userProfile.subscribedProjects = userProfile.subscribedProjects.filter(
        (id) => projectIds.indexOf(parseInt(id) as any) === -1
      );
    }
    if (companyIds?.length) {
      userProfile.subscribedCompanies = userProfile.subscribedCompanies.filter((id) => companyIds.indexOf(id) === -1);
    }
    if (projectCompanyIds?.length) {
      userProfile.subscribedProjectCompanies = userProfile.subscribedProjectCompanies.filter(
        (id) => projectCompanyIds.indexOf(id) === -1
      );
    }

    return userProfile;
  }

  async getTenantUserProfiles(userIds?: string[]) {
    const tenantId = this.reqContextResolutionService.getTenantId();
    const query = this.utRepository
      .createQueryBuilder('user_tenant')
      .innerJoin('user_tenant.tenant', 'tenant')
      .leftJoinAndSelect('user_tenant.roles', 'role')
      .leftJoinAndSelect('user_tenant.user', 'user')
      .where('tenant.id = :tenantId', {
        tenantId,
      });

    if (userIds?.length) {
      query.andWhere('user_tenant.user.id IN (:...userIds)', { userIds });
    }
    const result = await query.getMany();
    const users = result.map(({ user }) => user);
    const externalIds = users
      .filter(({ externalAuthSystemId }) => externalAuthSystemId)
      .map(({ externalAuthSystemId }) => externalAuthSystemId);
    let userProfiles = (await this.searchUserProfiles(externalIds)) || [];

    let createUserProfilePromises: Promise<UserProfile>[] = [];

    if (userProfiles?.length !== externalIds?.length) {
      // some of the users not have assign an user profile yet
      const userProfileIds = userProfiles.map(({ id }) => id);

      createUserProfilePromises = externalIds
        .filter((id) => userProfileIds.indexOf(id) === -1)
        .map((id) => this.createUserProfile(id)); // promise for creating default userProfile
    }

    await Promise.all(createUserProfilePromises).then((value) => (userProfiles = userProfiles.concat(value)));

    return userProfiles;
  }

  async getUserProfile(id: string) {
    let userProfile = await this.userProfileRepository.findOne({ where: { id } });

    if (!userProfile) {
      userProfile = await this.createUserProfile(id);
    }

    return userProfile;
  }

  async getUsersByExternalAuthSystemIds(externalAuthSystemIds: string[]) {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .innerJoin(UserTenant, 'userTenants', 'user.id = userTenants.userId')
      .where('user.externalAuthSystemId IN (:...externalAuthSystemIds)', { externalAuthSystemIds })
      .getMany();

    return users;
  }

  searchUserProfiles(externalSystemIds: string[]) {
    return externalSystemIds.length && this.userProfileRepository.find({ where: { id: In(externalSystemIds) } });
  }

  searchUserByExternalIds(externalSystemIds: string[]) {
    return (
      externalSystemIds.length && this.userRepository.find({ where: { externalAuthSystemId: In(externalSystemIds) } })
    );
  }

  private async getFavoriteCompanies() {
    const tenantId = this.reqContextResolutionService.getTenantId();

    return this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndMapOne(
        'company.tenantCompanyRelation',
        TenantCompanyRelationship,
        `tenant_company_relationships`,
        'company.id="tenant_company_relationships"."companyId" AND "tenant_company_relationships"."tenantId" = :tenantId',
        { tenantId }
      )
      .where(`tenant_company_relationships.isFavorite=1`)
      .getMany();
  }

  private async getAvailableProjects(externalSystemId?: string) {
    const user = await this.userRepository.findOneOrFail({
      externalAuthSystemId: externalSystemId ?? this.reqContextResolutionService.getUserId(),
    });

    const query = this.projectRepository
      .createQueryBuilder('project')
      .loadAllRelationIds({
        relations: ['projectCollaboration'],
      })
      .leftJoinAndSelect('project.projectCompany', 'projectCompany')
      .leftJoinAndSelect('project.collaborations', 'projectCollaboration');

    query.andWhere('projectCollaboration.userId =:userId', {
      userId: user.id,
    });
    query.andWhere('projectCollaboration.status =:status', {
      status: CollaborationStatus.ACCEPT,
    });

    return query.getMany();
  }
  async createUserProfile(externalSystemId: string): Promise<UserProfile> {
    const projectsAvailable = await this.getAvailableProjects(externalSystemId);
    const subscribedProjects = projectsAvailable.map(({ id }) => `${id}`);
    const subscribedProjectCompanies = projectsAvailable.reduce((acc: string[], project: Project) => {
      return [...acc, ...project.projectCompany.map(({ companyId }: ProjectCompany) => companyId)];
    }, []);

    const subscribedCompanies = (await this.getFavoriteCompanies()).map(({ id }) => id);

    const userProfile = await this.userProfileRepository.find({ id: externalSystemId });
    if (userProfile.length === 0) {
      await this.userProfileRepository.insert({
        id: externalSystemId,
        subscribedProjects,
        subscribedCompanies,
        subscribedProjectCompanies,
      });
    } else {
      await this.userProfileRepository.update(
        { id: externalSystemId },
        {
          subscribedProjects,
          subscribedCompanies,
          subscribedProjectCompanies,
        }
      );
    }
    return this.userProfileRepository.findOne({ id: externalSystemId });
  }

  async subscribeAllUsersToTopic(
    subscriptionData: {
      projectIds?: number[];
      companyIds?: string[];
      projectCompanyIds?: string[];
    },
    userIds?: string[]
  ) {
    let userProfiles: any =
      (await this.getTenantUserProfiles(userIds)).filter(
        (item) => item !== undefined && !!item.subscribedCompanies.length
      ) || [];
    userProfiles = userProfiles.map(this.assignTopicToUserProfile.bind(null, subscriptionData));

    return this.userProfileRepository.save(userProfiles);
  }

  async unsubscribeAllUsersFromTopic(
    subscriptionData: {
      projectIds?: string[];
      companyIds?: string[];
      projectCompanyIds?: string[];
    },
    userIds?: string[]
  ) {
    let userProfiles: any = (await this.getTenantUserProfiles(userIds)) || [];

    userProfiles = userProfiles.map(this.removeTopicFromUserProfile.bind(null, subscriptionData));

    return this.userProfileRepository.save(userProfiles);
  }

  async subscribeToTopic(subscriptionData: {
    projectIds?: string[];
    companyIds?: string[];
    projectCompanyIds?: string[];
  }): Promise<UserProfile> {
    const userId = this.reqContextResolutionService.getUserId();
    let userProfile = await this.userProfileRepository.findOne({ id: userId });

    userProfile = this.assignTopicToUserProfile(
      subscriptionData,
      userProfile || (await this.createUserProfile(userId))
    );

    return this.userProfileRepository.save(userProfile);
  }

  async unsubscribeFromTopic(subscriptionData: {
    projectIds?: string[];
    companyIds?: string[];
    projectCompanyIds?: string[];
  }): Promise<UserProfile> {
    const userId = this.reqContextResolutionService.getUserId();
    let userProfile = await this.userProfileRepository.findOneOrFail({ id: userId });

    userProfile = this.removeTopicFromUserProfile(subscriptionData, userProfile);

    return this.userProfileRepository.save(userProfile);
  }

  async subscribeToCategoryTopic(category: string): Promise<UserProfile> {
    const userId = this.reqContextResolutionService.getUserId();
    const userProfile = await this.userProfileRepository.findOne({ id: userId });
    switch (category) {
      case NotificationCategory.GLOBAL:
        break;
      case NotificationCategory.PROJECTS:
        userProfile.subscribedProjects = (await this.getAvailableProjects()).map(({ id }) => `${id}`);
        break;
      case NotificationCategory.PROJECT_COMPANIES:
        userProfile.subscribedProjectCompanies = (await this.getAvailableProjects()).reduce(
          (acc: string[], project: Project) => {
            return [...acc, ...project.projectCompany.map(({ companyId }: ProjectCompany) => companyId)];
          },
          []
        );
        break;
      case NotificationCategory.FAVORITE_COMPANIES:
        userProfile.subscribedCompanies = (await this.getFavoriteCompanies()).map(({ id }) => id);
        break;
      default:
        break;
    }

    return this.userProfileRepository.save(userProfile);
  }

  async unsubscribeFromCategoryTopic(category: string) {
    const userId = this.reqContextResolutionService.getUserId();
    const userProfile = await this.userProfileRepository.findOne({ id: userId });

    switch (category) {
      case NotificationCategory.GLOBAL:
        break;
      case NotificationCategory.PROJECTS:
        userProfile.subscribedProjects = [];
        break;
      case NotificationCategory.PROJECT_COMPANIES:
        userProfile.subscribedProjectCompanies = [];
        break;
      case NotificationCategory.FAVORITE_COMPANIES:
        userProfile.subscribedCompanies = [];
        break;
      default:
        break;
    }

    return this.userProfileRepository.save(userProfile);
  }

  // this operation remove company from all subscribedCompanies of all users by tenantId
  async removeCompanyfromSubscribedCompaniesByTenantId(companies: string[], tenantConnection: Connection) {
    try {
      const userProfileRepository = tenantConnection.getRepository(UserProfile);
      const userProfileSelectQuery = userProfileRepository.createQueryBuilder('userProfile').select();

      // get all userProfiles by subscribedCompanies
      let t = 0;
      let x = 0;
      for (const company of companies) {
        userProfileSelectQuery.orWhere(`userProfile.subscribedCompanies LIKE :${t}`, {
          [t]: `%${company}%`,
        });
        userProfileSelectQuery.orWhere(`userProfile.subscribedProjectCompanies LIKE :${x}`, {
          [x]: `%${company}%`,
        });
        t++;
        x++;
      }

      const userProfiles = await userProfileSelectQuery.getMany();

      // split subscribedCompanies string into array and remove companyId
      userProfiles.forEach((userProfile) => {
        userProfile.subscribedCompanies = userProfile.subscribedCompanies
          .toString()
          .split(',')
          .filter((company) => !companies.includes(company));

        userProfile.subscribedProjectCompanies = userProfile.subscribedProjectCompanies
          .toString()
          .split(',')
          .filter((company) => !companies.includes(company));
      });

      if (userProfiles.length > 0) {
        return userProfileRepository.save(userProfiles);
      } else {
        this.logger.log('No user profiles found to delete');
      }
    } catch (e) {
      this.logger.error(e);
    }
  }
}
