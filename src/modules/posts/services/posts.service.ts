import { Injectable } from '@nestjs/common';

import { FindOptions } from '@/common/types/mongoose.type';

import { PostsMongodbRepository } from '../repositories/posts.mongodb.repository';
import { PostDocument } from '../schemas/posts.schema';

@Injectable()
export class PostsService {
  constructor(private readonly postsMongodbRepository: PostsMongodbRepository) {}

  async getPosts(findOptions: FindOptions<PostDocument>) {
    return this.postsMongodbRepository.findAll(findOptions);
  }

  async getPostTagCount(): Promise<any> {
    return this.postsMongodbRepository.findAllTagsWithCount();
  }
}
