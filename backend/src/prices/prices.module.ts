import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { PricesService } from './prices.service';
import { UserPriceEntity } from './entities/user-price.entity';
import { GameEntity } from '../games/entities/game.entity';
import { UserEntity } from '../users/entities/user.entity';

@Module({
  imports: [MikroOrmModule.forFeature([UserPriceEntity, GameEntity, UserEntity])],
  providers: [PricesService],
  exports: [PricesService],
})
export class PricesModule {}
