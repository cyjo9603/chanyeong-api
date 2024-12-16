import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';

import { FindOptions } from '@/common/types/mongoose.type';

import { Post, PostDocument } from '../schemas/posts.schema';

@Injectable()
export class PostsMongodbRepository {
  private DELETED_FILTER: FilterQuery<PostDocument> = { $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }] };

  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>,
  ) {}

  async findAll({ filter, sort, skip, limit }: FindOptions<PostDocument>) {
    const query = this.postModel.find({ ...this.DELETED_FILTER, ...filter });

    if (sort) {
      query.sort(sort);
    }

    if (skip) {
      query.skip(skip);
    }

    if (limit) {
      query.limit(limit);
    }

    const [results, totalCount] = await Promise.all([
      query.exec(),
      this.postModel.countDocuments({ ...this.DELETED_FILTER, ...filter }),
    ]);

    return { results, totalCount };
  }

  async findAllTagsWithCount(): Promise<any> {
    return this.postModel.aggregate([
      { $match: { tags: { $exists: true } } },
      { $project: { _id: 0, tags: 1 } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $project: { _id: 0, name: '$_id', count: 1 } },
      { $sort: { count: -1 } },
    ]);
  }
}
