import { Resolver, Query, Args } from '@nestjs/graphql';

import { PostsService } from '../services/posts.service';
import { PostTag } from '../schemas/post-tags.schema';
import { PostCategory } from '../constants/post.constant';

@Resolver(PostTag)
export class PostTagsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Query(() => [PostTag])
  async postTagCounts(@Args('category', { type: () => PostCategory, nullable: true }) category?: PostCategory) {
    return this.postsService.getPostTagCount(category);
  }
}
