import { BaseEntity, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Company } from '../company/company.entity';
import { User } from '../user/user.entity';
import { Asset } from './asset.entity';

@Entity()
export class AssetRelation extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Company, { nullable: true, eager: true, cascade: false })
  @JoinColumn()
  company: Company;

  @OneToOne(() => Asset, { primary: true, nullable: false, eager: true, cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  asset: Asset;

  @OneToOne(() => User, { nullable: true, eager: true, cascade: false })
  @JoinColumn()
  user: User;
}
