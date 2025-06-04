import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tenant } from './tenant.entity';

export enum StimulusPlan {
  STANDARD = 'standard',
  PREMIUM = 'premium',
  PREMIUM_PLUS = 'premium_plus',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
}

@Entity()
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  stimulusPlan: StimulusPlan;

  @Column({ nullable: true })
  paymentMethod: PaymentMethod;

  @Column()
  nameOnCard: string;

  @Column()
  cardNumber: string;

  @Column()
  cardExpirationDate: Date;

  @Column()
  postalCode: string;

  @Column()
  country: string;

  @OneToOne((_type) => Tenant)
  @JoinColumn()
  tenant: Tenant;

  @Column({ type: 'timestamp', nullable: true })
  @CreateDateColumn()
  created: Date;

  @Column({ type: 'timestamp', nullable: true })
  @UpdateDateColumn()
  updated: Date;
}
