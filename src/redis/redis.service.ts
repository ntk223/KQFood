import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { Redis as RedisConfig } from '@/constants/redis';

@Injectable()
export class RedisService {
  private readonly logger = new Logger('RedisService');

  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  /**
   * Lưu refresh token vào Redis với TTL
   * @param userId - ID của user
   * @param refreshToken - Refresh token cần lưu
   */
  async setRefreshToken(userId: number, refreshToken: string): Promise<void> {
    try {
      const key = RedisConfig.KEYS.REFRESH_TOKENS(userId.toString());
      await this.redis.setex(
        key,
        RedisConfig.EXPIRY_TIMES.REFRESH_TOKEN,
        refreshToken,
      );
      this.logger.log(`Refresh token saved for user ${userId}`);
    } catch (error) {
      this.logger.error(`Failed to save refresh token for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Lấy refresh token từ Redis
   * @param userId - ID của user
   * @returns Refresh token hoặc null nếu không tồn tại
   */
  async getRefreshToken(userId: number): Promise<string | null> {
    try {
      const key = RedisConfig.KEYS.REFRESH_TOKENS(userId.toString());
      const token = await this.redis.get(key);
      return token;
    } catch (error) {
      this.logger.error(`Failed to get refresh token for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Xóa refresh token từ Redis (logout)
   * @param userId - ID của user
   */
  async deleteRefreshToken(userId: number): Promise<void> {
    try {
      const key = RedisConfig.KEYS.REFRESH_TOKENS(userId.toString());
      await this.redis.del(key);
      this.logger.log(`Refresh token deleted for user ${userId}`);
    } catch (error) {
      this.logger.error(`Failed to delete refresh token for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Kiểm tra xem refresh token có tồn tại không
   * @param userId - ID của user
   * @returns true nếu token tồn tại, false nếu không
   */
  async hasRefreshToken(userId: number): Promise<boolean> {
    try {
      const key = RedisConfig.KEYS.REFRESH_TOKENS(userId.toString());
      const exists = await this.redis.exists(key);
      return exists === 1;
    } catch (error) {
      this.logger.error(`Failed to check refresh token for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Lấy thời gian sống còn lại của refresh token (seconds)
   * @param userId - ID của user
   * @returns Số giây còn lại hoặc -1 nếu không tồn tại
   */
  async getRefreshTokenTTL(userId: number): Promise<number> {
    try {
      const key = RedisConfig.KEYS.REFRESH_TOKENS(userId.toString());
      return await this.redis.ttl(key);
    } catch (error) {
      this.logger.error(`Failed to get TTL for user ${userId}:`, error);
      throw error;
    }
  }
}
