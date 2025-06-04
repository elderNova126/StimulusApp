import { Field, ArgsType } from '@nestjs/graphql';
import { DeleteArgs } from './deleteArgs';
@ArgsType()
export class ScenarioArgs {
  @Field({ nullable: true })
  id?: number;
  @Field({ nullable: true })
  created?: Date;
  @Field({ nullable: true })
  userId?: string;
  @Field({ nullable: true })
  updated?: Date;
  @Field({ nullable: true })
  name?: string;
  @Field({ nullable: true })
  public?: boolean;
}

@ArgsType()
export class ScenarioSearchArgs extends ScenarioArgs {
  @Field({ nullable: true })
  page: number;
  @Field({ nullable: true })
  limit: number;
  @Field({ nullable: true })
  orderBy: string;
  @Field({ nullable: true })
  direction: string;
}

@ArgsType()
export class ScenarioSearchGrpcArgs extends ScenarioSearchArgs {
  @Field({ nullable: true })
  userId: string;
}

@ArgsType()
export class ScenarioGrpcArgs extends DeleteArgs {
  @Field({ nullable: true })
  userId: string;
}
