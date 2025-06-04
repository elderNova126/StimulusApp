import { Controller, UseInterceptors, UseFilters } from '@nestjs/common';
import { ProductService } from './product.service';
import { GrpcMethod } from '@nestjs/microservices';
import { Product } from './product.entity';
import { LoggingInterceptor } from '../logging/logger.interceptor';
import { GrpcExceptionFilter } from '../shared/utils-grpc/grpc-exception-filter';

@Controller('product')
@UseFilters(GrpcExceptionFilter)
@UseInterceptors(LoggingInterceptor)
export class ProductController {
  constructor(private productService: ProductService) {}

  @GrpcMethod('DataService', 'SearchProducts')
  async searchProducts(data: any): Promise<{ results: Product[]; count: number }> {
    const { query, product: filters } = data;

    const [results, count] = await this.productService.getProducts(filters, query);

    return { results, count };
  }

  @GrpcMethod('DataService', 'CreateProduct')
  async createProduct(data: any): Promise<Product> {
    const { dataTraceSource, userId, traceFrom, product } = data;
    return this.productService.createProduct(product, { dataTraceSource, meta: { userId, method: traceFrom } });
  }

  @GrpcMethod('DataService', 'DeleteProduct')
  async deleteProduct(data: any): Promise<any> {
    const res = await this.productService.deleteProduct(data.id);

    return { done: res.affected > 0 };
  }

  @GrpcMethod('DataService', 'UpdateProduct')
  async updateProduct(data: any): Promise<Product> {
    const { dataTraceSource, userId, traceFrom, product: productData } = data;
    const { id, ...product } = productData;

    return this.productService.updateProduct(id, product, { dataTraceSource, meta: { userId, method: traceFrom } });
  }
}
