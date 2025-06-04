import { IOrderDTO } from 'src/shared/order.interface';
import { DeleteResult } from 'typeorm';
import { GlobalSupplier } from './global-supplier.entity';

export class GlobalSupplierProvider {
  static buildGlobalSuppliers(projectId: number, companyId: string): GlobalSupplier[] {
    return [this.buildGlobalSupplier(projectId, companyId)];
  }

  static buildGlobalSupplier(projectId: number, companyId: string): GlobalSupplier {
    const globalSupplier: any = new GlobalSupplier();
    globalSupplier.id = 1;
    globalSupplier.globalProject = { id: projectId };
    globalSupplier.companyId = companyId;
    return globalSupplier;
  }

  static buildDeleteResult(): DeleteResult {
    const deleteResult = new DeleteResult();
    deleteResult.affected = 1;
    return deleteResult;
  }

  static buildOrder(): IOrderDTO {
    return { key: 'id', direction: 'DESC' };
  }
}
