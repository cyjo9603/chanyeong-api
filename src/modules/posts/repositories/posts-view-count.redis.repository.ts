import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class PostsViewCountRedisRepository {
  private readonly redis: Redis | null;

  private readonly DEFAULT_TTL = 60 * 60 * 6;
  private readonly VIEW_COUNT_REDIS_KEY = 'post_view_count';
  private readonly VIEW_COUNT_HISTORY_REDIS_KEY = 'post_view_count_history';

  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getOrThrow();
  }

  private async set(key: string, value: string, ttl = this.DEFAULT_TTL) {
    return this.redis.set(key, value, 'EX', ttl);
  }

  private async get(key: string) {
    return this.redis.get(key);
  }

  async hasViewHistory(postId: string, userCookie: string) {
    return this.get(`${this.VIEW_COUNT_HISTORY_REDIS_KEY}:${postId}:${userCookie}`);
  }

  async writePostViewCountHistory(postId: string, userCookie: string) {
    return this.set(`${this.VIEW_COUNT_HISTORY_REDIS_KEY}:${postId}:${userCookie}`, new Date().toISOString());
  }
}
