import { ObjectType, Field } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';

import { ObjectIdScalar } from '@/common/graphql/scalars/mongo-object-id.scalar';
import { UserRole } from '../constants/user.constant';

@ObjectType()
export class UserDto {
  @Field(() => ObjectIdScalar)
  _id: ObjectId;

  @Field(() => UserRole)
  role: UserRole;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String)
  userId: string;
}
