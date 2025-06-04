import { Company } from 'src/company/company.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'tags' })
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @JoinColumn()
  id: string;

  @Index({ where: "tags IS NOT NULL AND tags <> ''" })
  @Column({ nullable: true, length: 255 })
  tag: string;

  @Column({ type: 'timestamp', nullable: true })
  @CreateDateColumn()
  created: Date;

  @ManyToMany((_type) => Company, (company) => company.tags, { eager: false })
  company: Company;
}
