import { EntityRepository, Repository } from 'typeorm';
import { ProjectCompany } from '../project/projectCompany.entity';

@EntityRepository(ProjectCompany)
export class EvaluationCollectionRepository extends Repository<ProjectCompany> {
  public async getData() {
    const qb = this.createQueryBuilder('project_company')
      .leftJoinAndSelect('project_company.project', 'project')
      .leftJoinAndSelect('project.evaluationTemplate', 'evaluationTemplate')
      .leftJoinAndSelect('evaluationTemplate.customMetrics', 'customMetrics')
      .innerJoinAndSelect('project_company.evaluations', 'evaluations');
    return await qb.getMany();
  }

  public async getCompanyData(companyId: string) {
    const qb = this.createQueryBuilder('project_company')
      .where('project_company.companyId = :companyId', { companyId })
      .leftJoinAndSelect('project_company.project', 'project')
      .leftJoinAndSelect('project.evaluationTemplate', 'evaluationTemplate')
      .leftJoinAndSelect('evaluationTemplate.customMetrics', 'customMetrics')
      .innerJoinAndSelect('project_company.evaluations', 'evaluations');
    return await qb.getMany();
  }
}
