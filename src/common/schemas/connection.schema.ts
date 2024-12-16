import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

@ObjectType()
export class PageInfo {
  @Field()
  hasNext: boolean;
}

export function connectionGenerator<T>(classRef: Type<T>): any {
  @ObjectType({ isAbstract: true })
  abstract class Connection {
    @Field(() => [classRef], { nullable: true })
    nodes: T[];

    @Field(() => PageInfo)
    pageInfo: PageInfo;

    @Field(() => Int)
    totalCount: number;
  }

  return Connection;
}
