// cache.service.ts
import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis-config.module'; // the token you defined earlier
/*
hiepnh add redis module
*/
@Injectable()
export class CacheService {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis, // ioredis client
  ) {}

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    return data ? (JSON.parse(data) as T) : null;
  }

  /**
   * Set value to cache with optional TTL (in seconds)
   */
  async set(
    key: string,
    value: any,
    ttl: string | number = '7d',
  ): Promise<void> {
    const ttlSeconds = typeof ttl === 'string' ? this.parseTTL(ttl) : ttl;
    await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  /**
   * Delete cache key
   */
  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async delKeys(keys: string[]): Promise<void> {
    await this.redis.del(keys);
  }

  /**
   * Check if a key exists
   */
  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key);
    return result === 1;
  }

  async keys(key: string): Promise<string[]> {
    return await this.redis.keys(key);
  }

  /**
   * Flush all keys (be careful!)
   */
  async flush(): Promise<void> {
    await this.redis.flushdb();
  }

  parseTTL(ttl: string): number {
    const match = ttl.match(/^(\d+)([smhd])$/);

    if (!match) throw new Error('Invalid TTL format. Use: 10s, 5m, 1h, 7d');

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 60 * 60 * 24;
      default:
        throw new Error('Invalid time unit');
    }
  }
}
