import { Module, Global, OnModuleInit, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.get<string>('REDIS_HOST') || 'localhost',
          port: configService.get<number>('REDIS_PORT') || 6379,
          password: configService.get<string>('REDIS_PASSWORD'),
          // Trì hoãn kết nối cho đến khi gọi connect()
          lazyConnect: true,
          // Tự động thử lại nếu mất kết nối
          retryStrategy: (times) => Math.min(times * 50, 2000),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule implements OnModuleInit {
  private readonly logger = new Logger('RedisModule'); // Tạo logger với context là RedisModule

  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async onModuleInit() {
    // Đăng ký event listener trước khi kết nối
    this.redis.on('connect', () => {
      this.logger.log('Redis storage connecting...');
    });

    this.redis.on('ready', () => {
      this.logger.log('✅ Redis client is ready and connected!');
    });

    this.redis.on('error', (err) => {
      this.logger.error('❌ Redis connection error:');
      this.logger.error(err);
    });

    // Bắt đầu kết nối sau khi đã đăng ký listener
    try {
      await this.redis.connect();
      this.logger.log('Redis connection initiated');
    } catch (error) {
      this.logger.error('Failed to connect to Redis:', error);
    }
  }
}
