import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RedisModule } from './redis/redis.module';

@Global()
@Module({
  imports: [ConfigModule, RedisModule],
  exports: [RedisModule],
})
export class CoreModule {}
