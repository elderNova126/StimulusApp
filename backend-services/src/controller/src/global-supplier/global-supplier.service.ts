import { Inject, Injectable } from '@nestjs/common';
import { Connection, In, Repository } from 'typeorm';
import { GLOBAL_CONNECTION } from '../database/database.constants';
import { GlobalSupplier } from './global-supplier.entity';

@Injectable()
export class GlobalSupplierService {
  private readonly globalSupplierRepository: Repository<GlobalSupplier>;
  constructor(@Inject(GLOBAL_CONNECTION) connection: Connection) {
    this.globalSupplierRepository = connection.getRepository(GlobalSupplier);
  }

  async findAll(): Promise<GlobalSupplier[]> {
    return this.globalSupplierRepository.find();
  }

  async findByProjectIdAndFatherId(projectTreeId: number[]): Promise<GlobalSupplier[]> {
    return this.globalSupplierRepository.find({
      where: {
        globalProject: { id: In(projectTreeId) },
      },
    });
  }

  async findSuppliersByProjectTreeIdAndCompanyId(projectTreeId: number, companyId: string): Promise<GlobalSupplier> {
    return this.globalSupplierRepository.findOne({
      where: {
        globalProject: { id: projectTreeId },
        companyId,
      },
    });
  }
}
