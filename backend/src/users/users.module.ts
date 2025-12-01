import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserEntity } from './entities/user.entity';
import { UserPriceEntity } from '../prices/entities/user-price.entity';
import { GameEntity } from '../games/entities/game.entity';

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity, UserPriceEntity, GameEntity])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
