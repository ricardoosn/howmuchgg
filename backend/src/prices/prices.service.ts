import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';

import { UserPriceEntity } from './entities/user-price.entity';
import { GameEntity } from '../games/entities/game.entity';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class PricesService {
  constructor(
    @InjectRepository(UserPriceEntity)
    private readonly userPriceRepository: EntityRepository<UserPriceEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,
  ) {}

  public async saveUserPrice(userId: number, game: GameEntity, povPrice: number): Promise<void> {
    const user = await this.userRepository.findOne({ id: userId });
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }
    const existing = await this.userPriceRepository.findOne({ user, game });
    if (existing) {
      existing.povPrice = povPrice;
      existing.updatedAt = new Date();
      await this.userPriceRepository.getEntityManager().persistAndFlush(existing);
      return;
    }
    const now = new Date();
    const userPrice = this.userPriceRepository.create({
      user,
      game,
      povPrice,
      createdAt: now,
      updatedAt: now,
    });
    await this.userPriceRepository.getEntityManager().persistAndFlush(userPrice);
  }
}
