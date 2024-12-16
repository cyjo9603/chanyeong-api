import { Resolver, Query } from '@nestjs/graphql';

import { PostsService } from '../services/posts.service';
import { PostTag } from '../schemas/post-tags.schema';

@Resolver(PostTag)
export class PostTagsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Query(() => [PostTag])
  async postTagCounts() {
    return this.postsService.getPostTagCount();
  }
}
