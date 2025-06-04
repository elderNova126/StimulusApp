import { Entity, BaseEntity, PrimaryGeneratedColumn, OneToOne, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { Project } from '../project/project.entity';
import { CustomMetric } from './custom-metric.entity';

@Entity()
export class EvaluationTemplate extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Project, (project) => project.evaluationTemplate, { nullable: false, eager: true })
  @JoinColumn()
  project: Project;

  @ManyToMany((_type) => CustomMetric, (customMetrics) => customMetrics.evaluation, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  customMetrics: CustomMetric[];
}
