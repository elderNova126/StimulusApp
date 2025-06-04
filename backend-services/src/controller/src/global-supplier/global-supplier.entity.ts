import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GlobalProject } from '../project-tree/project-tree.entity';

@Entity({ name: 'project_suppliers' })
export class GlobalSupplier {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => GlobalProject, (globalSupplier) => globalSupplier.GlobalSupplier)
  @JoinColumn()
  globalProject: GlobalProject;

  @Column()
  @JoinColumn()
  companyId: string;
}
