import { IsEnum } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, TreeChildren, TreeParent, Tree, OneToMany } from 'typeorm';
import { GlobalSupplier } from '../global-supplier/global-supplier.entity';
export enum EntityProjectType {
  COMPANY = 'COMPANY',
  TENANT = 'TENANT',
}

@Entity({ name: 'project_tree' })
@Tree('materialized-path')
export class GlobalProject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  projectId: number;

  @TreeChildren()
  subProjects: GlobalProject[];

  @TreeParent()
  parentProject: GlobalProject;

  @OneToMany((_type) => GlobalSupplier, (globalSupplier) => globalSupplier.globalProject, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  GlobalSupplier: GlobalSupplier[];

  @Column()
  @IsEnum(EntityProjectType)
  entityType: EntityProjectType;

  @Column()
  entityId: string;
}
