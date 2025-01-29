import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards, UsePipes } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

import { AppClsStore } from '@/common/types/cls.type';
import { ClsStoreKey } from '@/common/constants/cls.constant';
import { UserDto } from '@/modules/users/dtos/user.dto';

import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { RefreshJwtAuthGuard, AccessJwtAuthGuard } from '../guards/jwt-auth.guard';
import { RefreshValidationPipe } from '../pipes/refresh.validate.pipe';
import { LoginDto } from '../dtos/login.dto';
import { RefreshDto } from '../dtos/refresh.dto';
@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly clsService: ClsService<AppClsStore>,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Mutation(() => UserDto)
  async login(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Args() _: LoginDto,
  ): Promise<UserDto> {
    const { user } = await this.authService.signIn({ id: this.clsService.get(ClsStoreKey.USER_ID) });

    return user;
  }
  @UseGuards(RefreshJwtAuthGuard)
  @UsePipes(RefreshValidationPipe)
  @Mutation(() => UserDto)
  async refresh() {
    const { user } = await this.authService.signIn({ id: this.clsService.get(ClsStoreKey.USER_ID) });

    return user;
  }

  @UseGuards(RefreshJwtAuthGuard)
  @UsePipes(RefreshValidationPipe)
  @Mutation(() => RefreshDto)
  async _refresh() {
    const { accessToken, refreshToken, user } = await this.authService.signIn({
      id: this.clsService.get(ClsStoreKey.USER_ID),
    });

    return { accessToken, refreshToken, me: user, maxAge: this.authService.COOKIE_MAX_AGE };
  }

  @UseGuards(AccessJwtAuthGuard)
  @Mutation(() => UserDto)
  async logout() {
    return this.authService.logout(this.clsService.get(ClsStoreKey.USER_ID));
  }
}
