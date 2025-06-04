import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { ProductResponseUnion, ProductUnion } from '../models/product';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductSearchArgs, ProductArgs } from '../dto/productArgs';
import { ProductService } from './product.service';
import { DeleteArgs } from '../dto/deleteArgs';
import { ActionResponseUnion } from '../models/baseResponse';
import { GqlLoggingInterceptor } from '../logging/gql-logging.interceptor';
import { GlobalAdminScopeGuard } from '../auth/global-admin-scope.guard';
import { ScopeContextGuard } from '../auth/scope-context.guard';
import { GqlUser } from '../core/decorators/gql-decorators';
import { TracingArgs } from '../dto/tracingArgs';

@Resolver('Product')
@UseInterceptors(GqlLoggingInterceptor)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => ProductResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  products(@Args() productSearchArgs: ProductSearchArgs): Promise<typeof ProductResponseUnion> {
    return this.productService.searchProducts(productSearchArgs);
  }

  @Mutation(() => ProductUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  createProduct(
    @Args() productArgs: ProductArgs,
    @Args() tracingArgs: TracingArgs,
    @GqlUser() user
  ): Promise<typeof ProductUnion> {
    return this.productService.createProduct(productArgs, tracingArgs, user.sub);
  }

  @Mutation(() => ActionResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, GlobalAdminScopeGuard)
  deleteProduct(@Args() deleteArgs: DeleteArgs): Promise<typeof ActionResponseUnion> {
    return this.productService.deleteProduct(deleteArgs);
  }

  @Mutation(() => ProductUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  updateProduct(
    @Args() productArgs: ProductArgs,
    @Args() tracingArgs: TracingArgs,
    @GqlUser() user
  ): Promise<typeof ProductUnion> {
    return this.productService.updateProduct(productArgs, tracingArgs, user.sub);
  }
}
