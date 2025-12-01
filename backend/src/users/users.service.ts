import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';

import { UserEntity } from './entities/user.entity';
import { AuthUserPayload } from '../auth/types/auth-user.payload';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: EntityRepository<UserEntity>,
  ) {}

  public async upsertSteamUser(
    steamId: string,
    username: string,
    avatarUrl: string,
  ): Promise<AuthUserPayload> {
    const existing = await this.usersRepository.findOne({ steamId });
    if (existing) {
      existing.username = username;
      existing.avatarUrl = avatarUrl;
      existing.updatedAt = new Date();
      await this.usersRepository.getEntityManager().persistAndFlush(existing);
      return {
        id: existing.id,
        steamId: existing.steamId,
        username: existing.username,
        avatarUrl: existing.avatarUrl,
      };
    }
    const now = new Date();
    const user = this.usersRepository.create({
      steamId,
      username,
      avatarUrl,
      createdAt: now,
      updatedAt: now,
    });
    await this.usersRepository.getEntityManager().persistAndFlush(user);
    return {
      id: user.id,
      steamId: user.steamId,
      username: user.username,
      avatarUrl: user.avatarUrl,
    };
  }

  public async findProfileWithPrices(userId: number): Promise<{
    id: number;
    username: string;
    prices: Array<{ gameId: number; povPrice: number }>;
  }> {
    const user = await this.usersRepository.findOne(
      { id: userId },
      { populate: ['prices', 'prices.game'] },
    );
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }
    const prices = user.prices.getItems().map((price) => ({
      gameId: price.game.id,
      povPrice: price.povPrice,
    }));
    return { id: user.id, username: user.username, prices };
  }
}
