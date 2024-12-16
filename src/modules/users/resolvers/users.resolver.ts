import { Resolver, Query } from '@nestjs/graphql';
import { User } from '../schemas/user.schema';
import { UsersService } from '../services/users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User)
  async me() {
    // TODO: user id 삽입ㅌ
    return this.usersService.getUserByUserId('');
  }
}
