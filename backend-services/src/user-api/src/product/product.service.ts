import { Injectable, Inject } from '@nestjs/common';
import { ProductSearchArgs, ProductArgs } from '../dto/productArgs';
import { DeleteArgs } from '../dto/deleteArgs';
import { ProductResponseUnion, ProductUnion } from '../models/product';
import { ActionResponseUnion } from '../models/baseResponse';
import { ProtoServices, ServicesMapping } from '../core/proto.constants';
import { ControllerGrpcClientService } from '../core/controller-client-grpc.service';
import { TracingArgs } from '../dto/tracingArgs';

@Injectable()
export class ProductService {
  private readonly dataServiceMethods: any;
  constructor(
    @Inject(ServicesMapping[ProtoServices.DATA])
    private readonly controllerGrpcClientDataService: ControllerGrpcClientService
  ) {
    this.dataServiceMethods = this.controllerGrpcClientDataService.serviceMethods;
  }

  async searchProducts(productSearchArgs: ProductSearchArgs): Promise<typeof ProductResponseUnion> {
    const { query, companyId, ...product } = productSearchArgs;
    const productSearchGrpcArgs: any = { query, product };

    if (typeof companyId !== 'undefined') {
      productSearchGrpcArgs.product.company = { id: companyId };
    }

    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.searchProducts,

      productSearchGrpcArgs
    );
  }

  createProduct(productArgs: ProductArgs, tracingArgs: TracingArgs, userId: string): Promise<typeof ProductUnion> {
    const { companyId, ...productData } = productArgs;
    const { dataTraceSource, traceFrom } = tracingArgs;

    const createProductArgs = companyId ? { ...productData, company: { id: companyId } } : productData;

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.createProduct, {
      product: createProductArgs,
      userId,
      dataTraceSource,
      traceFrom: traceFrom ?? 'API',
    });
  }

  deleteProduct(productArgs: DeleteArgs): Promise<typeof ActionResponseUnion> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.deleteProduct, productArgs);
  }

  updateProduct(productArgs: ProductArgs, tracingArgs: TracingArgs, userId: string): Promise<typeof ProductUnion> {
    const { companyId, ...productData } = productArgs;
    const { dataTraceSource, traceFrom } = tracingArgs;

    const updateProductArgs = companyId ? { ...productData, company: { id: companyId } } : productData;

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.updateProduct, {
      product: updateProductArgs,
      userId,
      dataTraceSource,
      traceFrom: traceFrom ?? 'API',
    });
  }
}
