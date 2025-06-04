import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('minorityOwnershipDetail_company')
export class MinorityOwnershipDetailCompany {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  companyId: string;

  @Column({ nullable: true })
  minorityOwnershipDetailId: string;
}
