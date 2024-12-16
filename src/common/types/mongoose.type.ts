import { Document, FilterQuery, SortOrder } from 'mongoose';

export interface FindOptions<T extends Document> {
  filter?: FilterQuery<T>;
  sort?: { [key: string]: SortOrder };
  limit?: number;
  skip?: number;
}
