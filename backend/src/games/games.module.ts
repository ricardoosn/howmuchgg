import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { HttpModule } from '@nestjs/axios';

import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { GameEntity } from './entities/game.entity';
import { GameSnapshotEntity } from './entities/game-snapshot.entity';
import { UserPriceEntity } from '../prices/entities/user-price.entity';
import { PricesModule } from '../prices/prices.module';
import { SteamApiService } from './steam-api.service';

@Module({
  imports: [
    HttpModule,
    MikroOrmModule.forFeature([GameEntity, GameSnapshotEntity, UserPriceEntity]),
    PricesModule,
  ],
  controllers: [GamesController],
  providers: [GamesService, SteamApiService],
  exports: [GamesService],
})
export class GamesModule {}
