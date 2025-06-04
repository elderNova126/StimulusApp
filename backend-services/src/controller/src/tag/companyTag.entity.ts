import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('company_tags_tags')
export class CompanyTag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  companyId: string;

  @Column({ nullable: true })
  tagsId: string;
}
