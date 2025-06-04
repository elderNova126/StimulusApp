import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class DataPointArgs {
  @Field({ nullable: true })
  companyId: string;
  @Field({ nullable: true })
  id: number;
  @Field({ nullable: true })
  status: string;
  @Field({ nullable: true })
  created: string;
  @Field({ nullable: true })
  updated: string;
  @Field({ nullable: true })
  dataTimeStamp: string;
  @Field({ nullable: true })
  dataSerialId: string;
  @Field({ nullable: true })
  dataId: string;
  @Field({ nullable: true })
  dataValue: number;
  @Field({ nullable: true })
  dataTrace: string;
  @Field({ nullable: true })
  element: string;
}

@ArgsType()
export class DataPointSearchArgs extends DataPointArgs {
  @Field({ nullable: true })
  query: string;
}
