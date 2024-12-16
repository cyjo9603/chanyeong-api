import { Injectable } from '@nestjs/common';
import { UsersMongodbRepository } from '../repositories/users.mongodb.repository';
import { ClsService } from 'nestjs-cls';
import { ObjectId } from 'mongodb';

import { AppClsStore } from '@/common/types/cls.type';
import { ClsStoreKey } from '@/common/constants/cls.constant';
import { getDataLoader } from '@/common/utils/dataloader.util';

import { User } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersMongodbRepository: UsersMongodbRepository,
    private readonly clsService: ClsService<AppClsStore>,
  ) {}

  async getUserById(id: string | ObjectId): Promise<User | null> {
    const dataLoaders = this.clsService.get(ClsStoreKey.DATA_LOADERS);

    return getDataLoader(dataLoaders, this.usersMongodbRepository).load(id.toString());
  }

  async getUserByUserId(userId: string): Promise<User | null> {
    const dataLoaders = this.clsService.get(ClsStoreKey.DATA_LOADERS);

    return getDataLoader(dataLoaders, this.usersMongodbRepository, { keyField: 'userId' }).load(userId);
  }

  async updateRefreshToken(id: ObjectId, refreshToken: string) {
    return this.usersMongodbRepository.findbyIdAndUpdate(id, { refreshToken });
  }
}
