import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserMongooseSchema } from './schemas/user.schema';
import { UsersMongodbRepository } from './repositories/users.mongodb.repository';
import { UsersService } from './services/users.service';
import { UsersResolver } from './resolvers/users.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserMongooseSchema }])],
  providers: [UsersMongodbRepository, UsersService, UsersResolver],
})
export class UsersModule {}
