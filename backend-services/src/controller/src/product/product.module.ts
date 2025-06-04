import { UploadReportModule } from './../upload-report/upload-report.module';
import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductStreamController } from './product-stream.controller';
import { ProductStreamService } from './product-stream.service';
import { EventModule } from '../event/event.module';

@Module({
  imports: [EventModule, UploadReportModule],
  controllers: [ProductController, ProductStreamController],
  providers: [ProductService, ProductStreamService],
})
export class ProductModule {}
