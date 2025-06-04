import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ApiKeysResults {
  @Field(() => [ApiKey], { nullable: true })
  results: ApiKey[];
  @Field({ nullable: true })
  count: number;
}

@ObjectType()
export class ApiKey {
  @Field()
  id: string;
  @Field()
  name: string;
  @Field()
  apiKey: string;
  @Field()
  tenantId: string;
  @Field()
  status: string;
  @Field()
  created: string;
}
@ObjectType()
export class OperationSuccessfully {
  @Field()
  successful: boolean;
}
