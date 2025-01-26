import { Controller, Get } from '@nestjs/common';

import { PostsService } from '../services/posts.service';

@Controller('/api/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('/ids')
  async getPostIds() {
    return this.postsService.getAllPostIds();
  }
}
