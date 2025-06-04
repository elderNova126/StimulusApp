import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from '../company/company.entity';

@Entity()
export class CompanyNote extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany((_type) => CompanyNote, (note) => note.parentNote)
  replies: CompanyNote[];

  @ManyToOne((_type) => CompanyNote, (note) => note.replies, { nullable: true })
  @JoinColumn()
  parentNote: CompanyNote;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  status: string;

  @Column({ type: 'timestamp', nullable: true, update: false })
  @CreateDateColumn()
  created: Date;

  @Column({ type: 'timestamp', nullable: true, update: false })
  @UpdateDateColumn()
  updated: Date;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true, type: 'text' })
  body: string;

  @Column({ nullable: true })
  visibility: string;

  @Column({ nullable: true, type: 'text' })
  attachments: string;

  @Column({ update: false, type: 'rowversion' })
  rowversion: Buffer;

  @Column({ nullable: true })
  companyId: string;

  company: Company;

  @BeforeInsert()
  @BeforeUpdate()
  setCompanyId() {
    if (this.company) {
      this.companyId = this.company.id;
    }
  }
}
