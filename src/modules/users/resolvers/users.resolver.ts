import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

import { AppClsStore } from '@/common/types/cls.type';
import { ClsStoreKey } from '@/common/constants/cls.constant';
import { AccessJwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

import { UsersService } from '../services/users.service';
import { UserDto } from '../dtos/user.dto';

@Resolver(() => UserDto)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly clsService: ClsService<AppClsStore>,
  ) {}

  @UseGuards(AccessJwtAuthGuard)
  @Query(() => UserDto)
  async me() {
    const userId = this.clsService.get(ClsStoreKey.USER_ID);

    return this.usersService.getUserById(userId);
  }
}
