import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { Cron, CronExpression } from '@nestjs/schedule';

import { GameEntity } from './entities/game.entity';
import { GameSnapshotEntity } from './entities/game-snapshot.entity';
import { GameMetricsDto } from './dto/game-metrics.dto';
import { UserPriceEntity } from '../prices/entities/user-price.entity';
import { PricesService } from '../prices/prices.service';
import { SteamApiService } from './steam-api.service';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly gamesRepository: EntityRepository<GameEntity>,
    @InjectRepository(GameSnapshotEntity)
    private readonly snapshotRepository: EntityRepository<GameSnapshotEntity>,
    @InjectRepository(UserPriceEntity)
    private readonly userPriceRepository: EntityRepository<UserPriceEntity>,
    private readonly pricesService: PricesService,
    private readonly steamApiService: SteamApiService,
  ) {}

  public async findAll(): Promise<GameEntity[]> {
    return this.gamesRepository.findAll();
  }

  public async findOneById(id: number): Promise<GameEntity> {
    const game = await this.gamesRepository.findOne({ id });
    if (!game) {
      throw new NotFoundException(`Game ${id} not found`);
    }
    return game;
  }

  public async getMetrics(gameId: number): Promise<GameMetricsDto> {
    const prices = await this.userPriceRepository.find({ game: gameId });
    if (prices.length === 0) {
      return { median: 0, average: 0, count: 0 };
    }
    const sorted = prices.map((price) => price.povPrice).sort((left, right) => left - right);
    const middle = Math.floor(sorted.length / 2);
    const median =
      sorted.length % 2 !== 0
        ? sorted[middle]
        : Math.round((sorted[middle - 1] + sorted[middle]) / 2);
    const sum = sorted.reduce((total, value) => total + value, 0);
    const average = Math.round(sum / sorted.length);
    return { median, average, count: prices.length };
  }

  public async submitPrice(userId: number, gameId: number, povPrice: number): Promise<void> {
    const game = await this.findOneById(gameId);
    await this.pricesService.saveUserPrice(userId, game, povPrice);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  public async executeDailySync(): Promise<void> {
    await this.refreshGamesFromSteam();
  }

  public async refreshGamesFromSteam(): Promise<void> {
    const mostPlayed = await this.steamApiService.fetchMostPlayed();
    for (const item of mostPlayed) {
      const details = await this.steamApiService.fetchAppDetails(item.appId);
      const existing = await this.gamesRepository.findOne({ steamAppId: item.appId });
      if (existing) {
        existing.name = details.name;
        existing.price = details.price;
        existing.currency = details.currency;
        existing.metadata = details.metadata;
        existing.playerPeak = item.peakPlayers;
        existing.updatedAt = new Date();
        await this.gamesRepository.getEntityManager().persistAndFlush(existing);
        await this.saveSnapshot(existing);
        continue;
      }
      const now = new Date();
      const game = this.gamesRepository.create({
        steamAppId: item.appId,
        name: details.name,
        price: details.price,
        currency: details.currency,
        metadata: details.metadata,
        playerPeak: item.peakPlayers,
        createdAt: now,
        updatedAt: now,
      });
      await this.gamesRepository.getEntityManager().persistAndFlush(game);
      await this.saveSnapshot(game);
    }
  }

  private async saveSnapshot(game: GameEntity): Promise<void> {
    const now = new Date();
    const snapshot = this.snapshotRepository.create({
      game,
      price: game.price,
      playerPeak: game.playerPeak,
      date: now,
      createdAt: now,
      updatedAt: now,
    });
    await this.snapshotRepository.getEntityManager().persistAndFlush(snapshot);
  }
}
