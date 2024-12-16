import { PipeTransform, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClsService } from 'nestjs-cls';

import { AppClsStore } from '@/common/types/cls.type';
import { ClsStoreKey } from '@/common/constants/cls.constant';
import { UsersService } from '@/modules/users/services/users.service';

@Injectable()
export class RefreshValidationPipe implements PipeTransform {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly clsService: ClsService<AppClsStore>,
  ) {}

  async transform(value: any) {
    const userId = this.clsService.get(ClsStoreKey.USER_ID);
    const user = await this.usersService.getUserById(userId);

    const req = this.clsService.get(ClsStoreKey.REQUEST);

    if (user.refreshToken !== req.cookies[this.configService.get<string>('auth.cookie.name.refresh')]) {
      throw new UnauthorizedException();
    }

    return value;
  }
}
