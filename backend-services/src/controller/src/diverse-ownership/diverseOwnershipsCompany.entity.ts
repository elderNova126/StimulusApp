import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('diverseOwnership_company')
export class CompanyTag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  companyId: string;

  @Column({ nullable: true })
  diverseOwnership: string;
}
