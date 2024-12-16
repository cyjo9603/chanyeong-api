import { ClsStore } from 'nestjs-cls';
import DataLoader from 'dataloader';

import { ClsStoreKey } from '../constants/cls.constant';

export interface AppClsStore extends ClsStore {
  [ClsStoreKey.DATA_LOADERS]: Record<string, DataLoader<string, any>>;
}
