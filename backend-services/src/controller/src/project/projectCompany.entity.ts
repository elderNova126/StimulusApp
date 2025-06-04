import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Company } from '../company/company.entity';
import { Project } from './project.entity';
import { CompanyEvaluation } from '../evaluation/company-evaluation.entity';
import { CompanyType } from './project.constants';

@Entity()
export class ProjectCompany extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((_type) => Project, (project) => project.projectCompany, {
    eager: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  project: Project;

  @OneToMany(() => CompanyEvaluation, (evaluation) => evaluation.projectCompany, {
    eager: true,
    cascade: ['recover', 'insert', 'remove'],
    onDelete: 'CASCADE',
  })
  evaluations: CompanyEvaluation[];

  @Column({ nullable: true })
  companyId: string;

  company: Company;

  @Column()
  type: CompanyType;

  @Column('simple-json', { nullable: true })
  criteriaAnswers: { criteria: string; answer: boolean }[];
}
