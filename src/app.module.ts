import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { UsersModule } from '@/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AuthModule } from '@/auth/auth.module';
import databaseConfig from '@/config/database.config';
import appConfig from '@/config/app.config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TransformInterceptor } from '@/interceptor/transform.interceptor';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { HttpExceptionFilter } from '@/exception/http-exception.filter';
import { TokenModule } from './token/token.module';
import { Throttle, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [databaseConfig.KEY], // Inject namespace 'database'
      useFactory: async (config: ReturnType<typeof databaseConfig>) => ({
        type: 'postgres',
        host: config.host,
        port: config.port as unknown as number,
        username: config.user,
        password: config.password,
        database: config.name,
        // Tự động load các file entity (user.entity.ts,...) vào TypeORM
        autoLoadEntities: true,
        // DEV ONLY: Tự động tạo bảng theo code (tắt khi lên Production)
        synchronize: true,
        namingStrategy: new SnakeNamingStrategy(),
      }),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      }
    ]),
    UsersModule,
    AuthModule,
    TokenModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
    ,
    // {
    //   provide: APP_PIPE,
    //   useClass: ValidationPipe,
    // }
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    }
  ],
})
export class AppModule {}
