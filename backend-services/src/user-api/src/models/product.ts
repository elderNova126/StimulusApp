import { Company } from './company';
import { Field, ObjectType, createUnionType } from '@nestjs/graphql';
import { ErrorResponse } from './baseResponse';

@ObjectType()
export class Product {
  @Field()
  id: string;

  @Field({ nullable: true })
  status: string;

  @Field({ nullable: true })
  created: string;

  @Field({ nullable: true })
  updated: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  type: string;

  @Field(() => Company, { nullable: true })
  company: Company;

  @Field({ nullable: true })
  description: string;
}

@ObjectType()
export class ProductResponse {
  @Field(() => [Product], { nullable: true })
  results: Product[];
  @Field({ nullable: true })
  count: number;
}

export const ProductUnion = createUnionType({
  name: 'ProductUnion',
  types: () => [Product, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return Product;
  },
});

export const ProductResponseUnion = createUnionType({
  name: 'ProductResponseUnion',
  types: () => [ProductResponse, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return ProductResponse;
  },
});
