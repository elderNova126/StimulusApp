import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CompanyTenantResult {
  @Field({ nullable: true })
  id: number;
  @Field()
  name: string;
  @Field()
  departmentName: string;
  @Field()
  ein: string;
  @Field()
  duns: string;
  @Field()
  created: string;
  @Field()
  updated: string;
}
