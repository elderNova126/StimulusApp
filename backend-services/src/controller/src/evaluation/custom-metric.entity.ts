import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { EvaluationTemplate } from './evaluation-template.entity';

@Entity()
export class CustomMetric extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany((_type) => EvaluationTemplate, (evaluation) => evaluation.customMetrics, { onDelete: 'CASCADE' })
  evaluation: EvaluationTemplate;

  @Column()
  exceptionalValue: number;

  @Column()
  metExpectationsValue: number;

  @Column()
  unsatisfactoryValue: number;

  @Column({ nullable: true })
  extendsCategory: string;
}
