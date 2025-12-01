import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

import { CoreModule } from './core/core.module';
import { GamesModule } from './games/games.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PricesModule } from './prices/prices.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    MikroOrmModule.forRoot({
      driver: PostgreSqlDriver,
      autoLoadEntities: true,
      dbName: process.env.POSTGRES_DB ?? 'gameworth',
      user: process.env.POSTGRES_USER ?? 'gameworth',
      password: process.env.POSTGRES_PASSWORD ?? 'gameworth',
      host: process.env.POSTGRES_HOST ?? 'postgres',
      port: Number(process.env.POSTGRES_PORT ?? 5432),
    }),
    CoreModule,
    GamesModule,
    UsersModule,
    AuthModule,
    PricesModule,
  ],
})
export class AppModule {}
