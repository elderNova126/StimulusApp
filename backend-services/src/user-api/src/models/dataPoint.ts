import { Company } from './company';
import { Field, ObjectType, createUnionType } from '@nestjs/graphql';
import { ErrorResponse } from './baseResponse';

@ObjectType()
export class DataPoint {
  @Field()
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
  @Field(() => Company, { nullable: true })
  company: Company;
}

export const DataPointUnion = createUnionType({
  name: 'DataPointResponse',
  types: () => [DataPoint, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return DataPoint;
  },
});
