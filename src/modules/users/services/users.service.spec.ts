import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClsModule } from 'nestjs-cls';

import { ClsStoreKey } from '@/common/constants/cls.constant';

import { UsersMongodbRepository } from '../repositories/users.mongodb.repository';
import { UsersService } from './users.service';
import { User } from '../schemas/user.schema';

describe('UserService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
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
        UsersService,
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
