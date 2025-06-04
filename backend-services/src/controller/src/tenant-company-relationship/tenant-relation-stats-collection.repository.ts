import { CompanyType, ProjectStatus } from 'src/project/project.constants';
import { EntityRepository, Repository } from 'typeorm';
import { Project } from '../project/project.entity';

@EntityRepository(Project)
export class TenantRelationStatsCollectionRepository extends Repository<Project> {
  public async getStatsData(companyId?: string) {
    const qb = this.createQueryBuilder('project')
      .leftJoinAndSelect('project.projectCompany', 'projectCompany')
      .leftJoinAndSelect('projectCompany.evaluations', 'evaluations')
      .where('project.status IN (:...status)', { status: [ProjectStatus.COMPLETED] });
    if (companyId) {
      qb.andWhere('projectCompany.companyId = :companyId', { companyId });
    }
    const projects = await qb.getMany();

    return projects.reduce(
      (acc, project) => ({
        ...acc,
        ...project.projectCompany
          ?.filter(({ type }) => type === CompanyType.AWARDED)
          ?.reduce?.(
            (acc, curr) => ({
              ...acc,
              [curr.companyId]: {
                noOfEvaluations: (!!curr.evaluations?.length ? 1 : 0) + (acc[curr.companyId]?.noOfEvaluations ?? 0),
                noOfProjects: (acc[curr.companyId]?.noOfProjects ?? 0) + 1,
                totalSpent:
                  Number(acc[curr.companyId]?.totalSpent ?? 0) +
                  Number(curr.evaluations?.reduce?.((acc, curr) => acc + curr.budgetSpend, 0) ?? 0),
              },
            }),
            acc
          ),
      }),
      {}
    );
  }
}
