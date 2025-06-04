import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class FindApiKeysArgs {
  @Field()
  tenantId: string;
}

@ArgsType()
export class BaseEntity {
  @Field()
  id: string;
}

@ArgsType()
export class CreateApiKeyArgs {
  @Field()
  name: string;
}

@ArgsType()
export class UpdateApiKeyArgs extends BaseEntity {
  @Field()
  name: string;
  @Field()
  status: string; // ACTIVE O INATIVE
}
@ArgsType()
export class ChangeStatusApiKeyArgs {
  @Field()
  id: string;
  @Field()
  status: string; // ACTIVE O INATIVE
}
