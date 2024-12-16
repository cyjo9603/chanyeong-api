import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClsModule } from 'nestjs-cls';
import { ConfigModule } from '@nestjs/config';

import { ClsStoreKey } from '@/common/constants/cls.constant';

import { UsersMongodbRepository } from '../repositories/users.mongodb.repository';
import { UsersResolver } from './users.resolver';
import { UsersService } from '../services/users.service';
import { User } from '../schemas/user.schema';
import configuration from '../../../../config/configuration';

describe('UsersResolver', () => {
  let resolver: UsersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],

          cache: true,
        }),
        ClsModule.forRoot({
          global: true,
          middleware: {
            mount: true,
            setup: (cls) => {
              cls.set(ClsStoreKey.DATA_LOADERS, {});
            },
          },
        }),
      ],
      providers: [
        {
          provide: getModelToken(User.name),
          useValue: Model,
        },
        UsersMongodbRepository,
        UsersResolver,
        UsersService,
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
