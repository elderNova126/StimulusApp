import { Module } from '@nestjs/common';
import { GlobalSupplierService } from './global-supplier.service';

@Module({
  providers: [GlobalSupplierService],
  exports: [GlobalSupplierService],
})
export class GlobalSupplierModule {}
