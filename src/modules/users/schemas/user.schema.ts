import { Field, ObjectType, InputType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MaxLength, MinLength, IsJWT, IsAlphanumeric } from 'class-validator';
import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

import { ObjectIdScalar } from '@/common/graphql/scalars/mongo-object-id.scalar';

import { UserRole } from '../constants/user.constant';

export type UserDocument = User & Document;

registerEnumType(UserRole, { name: 'UserRole' });

@InputType({ isAbstract: true })
@ObjectType({ isAbstract: true })
@Schema({ collection: 'users' })
export class User {
  @Field(() => ObjectIdScalar)
  _id: ObjectId;

  @Field(() => UserRole)
  @Prop({
    type: String,
    required: true,
    enum: [UserRole.ADMIN],
    default: UserRole.ADMIN,
  })
  role: UserRole;

  @MaxLength(20)
  @MinLength(4)
  @IsAlphanumeric()
  @Field(() => String)
  @Prop({ type: String, required: true, index: true, unique: true })
  userId: string;

  @MaxLength(200)
  @Field(() => String)
  @Prop({ type: String, required: true })
  password: string;

  @MaxLength(20)
  @Field(() => String)
  @Prop({ type: String, required: true })
  firstName: string;

  @MaxLength(15)
  @Field(() => String)
  @Prop({ type: String, required: true })
  lastName: string;

  @IsJWT()
  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  refreshToken?: string;
}

export const UserMongooseSchema = SchemaFactory.createForClass(User);
