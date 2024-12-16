import { ClsStore } from 'nestjs-cls';
import DataLoader from 'dataloader';
import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';

import { ClsStoreKey } from '../constants/cls.constant';

export interface AppClsStore extends ClsStore {
  [ClsStoreKey.DATA_LOADERS]: Record<string, DataLoader<string, any>>;
  [ClsStoreKey.USER_ID]?: ObjectId;
  [ClsStoreKey.REQUEST]?: Request;
  [ClsStoreKey.RESPONSE]?: Response;
  [key: string]: any;
}
