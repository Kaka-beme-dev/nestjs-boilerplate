import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { CacheService } from './cache.service';
export const REDIS_CLIENT = 'REDIS_CLIENT';
/*
hiepnh add redis module
*/
@Global() // Optional if you want this module everywhere
@Module({
  imports: [ConfigModule], // ✅ Import ConfigModule here
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.get<string>('REDIS_HOST', 'localhost', {
            infer: true,
          }),
          port: configService.get<number>('REDIS_PORT', 6379, { infer: true }),
          password: configService.get<string>('REDIS_PASS', '', {
            infer: true,
          }),
          db: configService.get<number>('REDIS_DB', 0, { infer: true }),

          keyPrefix: `${configService.get<string>('APP_NAME', 'appPrefix', { infer: true })}:`, //Prefix for all queue keys.
          enableOfflineQueue: false,
          maxRetriesPerRequest: 1,
        });
      },
    },
    CacheService, // <-- Provide it
  ],
  exports: [REDIS_CLIENT, CacheService],
})
export class RedisModule {}

/*
import {
  BullRootModuleOptions,
  SharedBullConfigurationFactory,
} from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class BullMQConfigService implements SharedBullConfigurationFactory {
  constructor(private readonly configService: ConfigService) {}

  createSharedConfiguration():
    | Promise<BullRootModuleOptions>
    | BullRootModuleOptions {
    return {
      connection: {
        host: this.configService.get<string>('REDIS_HOST'),
        port: this.configService.get<number>('REDIS_PORT'),
        password: this.configService.get<string>('REDIS_PASS'),
        // db: this.configService.get<number>('REDIS_DB'),
        lazyConnect: true // If you want to keep the instance disconnected until the first command is called,
      },
      prefix: this.configService.get<string>('APP_NAME'), //Prefix for all queue keys.
    
    
    };
  }

  
}*/
