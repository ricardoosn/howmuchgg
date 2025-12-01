import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

import { GameSnapshotEntity } from '../games/entities/game-snapshot.entity';
import { GameEntity } from '../games/entities/game.entity';
import { UserPriceEntity } from '../prices/entities/user-price.entity';
import { UserEntity } from '../users/entities/user.entity';

type SnapshotSeed = { price: number; playerPeak: number; date: Date };
type GameSeed = {
  steamAppId: number;
  name: string;
  price: number;
  currency: string;
  metadata?: Record<string, unknown>;
  playerPeak: number;
  snapshots: SnapshotSeed[];
};
type UserPriceSeed = { steamAppId: number; povPrice: number };
type UserSeed = { steamId: string; username: string; avatarUrl: string; prices: UserPriceSeed[] };

const buildSnapshots = (
  count: number,
  basePrice: number,
  basePeak: number,
  startDateIso: string,
): SnapshotSeed[] => {
  const startTime = new Date(startDateIso).getTime();
  const dayMs = 24 * 60 * 60 * 1000;
  return Array.from({ length: count }, (_, index) => {
    const priceDrift = ((index % 5) - 2) * 25; // keep slight variation but stable
    const peakDrift = Math.max(0, basePeak - index * 500 + (index % 7) * 50);
    return {
      price: basePrice + priceDrift,
      playerPeak: peakDrift,
      date: new Date(startTime + index * dayMs),
    };
  });
};

const GAME_SEEDS: GameSeed[] = [
  {
    steamAppId: 570,
    name: 'Dota 2',
    price: 0,
    currency: 'USD',
    metadata: { genres: ['MOBA', 'Strategy'], developer: 'Valve', publisher: 'Valve' },
    playerPeak: 1299999,
    snapshots: buildSnapshots(20, 0, 1299999, '2024-01-01T00:00:00Z'),
  },
  {
    steamAppId: 730,
    name: 'Counter-Strike 2',
    price: 0,
    currency: 'USD',
    metadata: { genres: ['FPS', 'Competitive'], developer: 'Valve', publisher: 'Valve' },
    playerPeak: 1800000,
    snapshots: buildSnapshots(20, 0, 1800000, '2024-01-02T00:00:00Z'),
  },
  {
    steamAppId: 578080,
    name: 'PUBG: BATTLEGROUNDS',
    price: 2999,
    currency: 'USD',
    metadata: { genres: ['Battle Royale', 'Shooter'], developer: 'KRAFTON', publisher: 'KRAFTON' },
    playerPeak: 350000,
    snapshots: buildSnapshots(20, 2999, 350000, '2024-01-03T00:00:00Z'),
  },
  {
    steamAppId: 1172470,
    name: 'Apex Legends',
    price: 0,
    currency: 'USD',
    metadata: { genres: ['Battle Royale', 'Shooter'], developer: 'Respawn', publisher: 'EA' },
    playerPeak: 600000,
    snapshots: buildSnapshots(20, 0, 600000, '2024-01-04T00:00:00Z'),
  },
  {
    steamAppId: 271590,
    name: 'Grand Theft Auto V',
    price: 2999,
    currency: 'USD',
    metadata: { genres: ['Action', 'Open World'], developer: 'Rockstar North', publisher: 'Rockstar' },
    playerPeak: 364000,
    snapshots: buildSnapshots(20, 2999, 364000, '2024-01-05T00:00:00Z'),
  },
  {
    steamAppId: 1174180,
    name: 'Red Dead Redemption 2',
    price: 5999,
    currency: 'USD',
    metadata: { genres: ['Action', 'Open World'], developer: 'Rockstar', publisher: 'Rockstar' },
    playerPeak: 400000,
    snapshots: buildSnapshots(20, 5999, 400000, '2024-01-06T00:00:00Z'),
  },
  {
    steamAppId: 1091500,
    name: 'Cyberpunk 2077',
    price: 5999,
    currency: 'USD',
    metadata: { genres: ['RPG', 'Open World'], developer: 'CD PROJEKT RED', publisher: 'CD PROJEKT RED' },
    playerPeak: 136000,
    snapshots: buildSnapshots(20, 5999, 136000, '2024-01-07T00:00:00Z'),
  },
  {
    steamAppId: 1245620,
    name: 'ELDEN RING',
    price: 5999,
    currency: 'USD',
    metadata: { genres: ['Action', 'RPG'], developer: 'FromSoftware', publisher: 'Bandai Namco' },
    playerPeak: 953000,
    snapshots: buildSnapshots(20, 5999, 953000, '2024-01-08T00:00:00Z'),
  },
  {
    steamAppId: 1086940,
    name: "Baldur's Gate 3",
    price: 5999,
    currency: 'USD',
    metadata: { genres: ['RPG', 'Story Rich'], developer: 'Larian Studios', publisher: 'Larian Studios' },
    playerPeak: 875000,
    snapshots: buildSnapshots(20, 5999, 875000, '2024-01-09T00:00:00Z'),
  },
  {
    steamAppId: 1623730,
    name: 'Palworld',
    price: 2999,
    currency: 'USD',
    metadata: { genres: ['Survival', 'Co-op'], developer: 'Pocketpair', publisher: 'Pocketpair' },
    playerPeak: 2000000,
    snapshots: buildSnapshots(20, 2999, 2000000, '2024-01-10T00:00:00Z'),
  },
  {
    steamAppId: 252490,
    name: 'Rust',
    price: 3999,
    currency: 'USD',
    metadata: { genres: ['Survival', 'Multiplayer'], developer: 'Facepunch', publisher: 'Facepunch' },
    playerPeak: 300000,
    snapshots: buildSnapshots(20, 3999, 300000, '2024-01-11T00:00:00Z'),
  },
  {
    steamAppId: 359550,
    name: 'Tom Clancy’s Rainbow Six Siege',
    price: 1999,
    currency: 'USD',
    metadata: { genres: ['Tactical', 'Shooter'], developer: 'Ubisoft', publisher: 'Ubisoft' },
    playerPeak: 200000,
    snapshots: buildSnapshots(20, 1999, 200000, '2024-01-12T00:00:00Z'),
  },
  {
    steamAppId: 230410,
    name: 'Warframe',
    price: 0,
    currency: 'USD',
    metadata: { genres: ['Action', 'Co-op'], developer: 'Digital Extremes', publisher: 'Digital Extremes' },
    playerPeak: 200000,
    snapshots: buildSnapshots(20, 0, 200000, '2024-01-13T00:00:00Z'),
  },
  {
    steamAppId: 1085660,
    name: 'Destiny 2',
    price: 0,
    currency: 'USD',
    metadata: { genres: ['Shooter', 'MMO'], developer: 'Bungie', publisher: 'Bungie' },
    playerPeak: 316000,
    snapshots: buildSnapshots(20, 0, 316000, '2024-01-14T00:00:00Z'),
  },
  {
    steamAppId: 1716740,
    name: 'Starfield',
    price: 6999,
    currency: 'USD',
    metadata: { genres: ['RPG', 'Sci-fi'], developer: 'Bethesda Game Studios', publisher: 'Bethesda Softworks' },
    playerPeak: 330000,
    snapshots: buildSnapshots(20, 6999, 330000, '2024-01-15T00:00:00Z'),
  },
  {
    steamAppId: 990080,
    name: 'Hogwarts Legacy',
    price: 5999,
    currency: 'USD',
    metadata: { genres: ['Action', 'Open World'], developer: 'Avalanche Software', publisher: 'WB Games' },
    playerPeak: 879308,
    snapshots: buildSnapshots(20, 5999, 879308, '2024-01-16T00:00:00Z'),
  },
  {
    steamAppId: 582010,
    name: 'Monster Hunter: World',
    price: 2999,
    currency: 'USD',
    metadata: { genres: ['Action', 'Co-op'], developer: 'Capcom', publisher: 'Capcom' },
    playerPeak: 334000,
    snapshots: buildSnapshots(20, 2999, 334000, '2024-01-17T00:00:00Z'),
  },
  {
    steamAppId: 1446780,
    name: 'Monster Hunter Rise',
    price: 3999,
    currency: 'USD',
    metadata: { genres: ['Action', 'Co-op'], developer: 'Capcom', publisher: 'Capcom' },
    playerPeak: 130000,
    snapshots: buildSnapshots(20, 3999, 130000, '2024-01-18T00:00:00Z'),
  },
  {
    steamAppId: 292030,
    name: 'The Witcher 3: Wild Hunt',
    price: 3999,
    currency: 'USD',
    metadata: { genres: ['RPG', 'Open World'], developer: 'CD PROJEKT RED', publisher: 'CD PROJEKT RED' },
    playerPeak: 103000,
    snapshots: buildSnapshots(20, 3999, 103000, '2024-01-19T00:00:00Z'),
  },
  {
    steamAppId: 346110,
    name: 'ARK: Survival Evolved',
    price: 2999,
    currency: 'USD',
    metadata: { genres: ['Survival', 'Open World'], developer: 'Studio Wildcard', publisher: 'Studio Wildcard' },
    playerPeak: 300000,
    snapshots: buildSnapshots(20, 2999, 300000, '2024-01-20T00:00:00Z'),
  },
  {
    steamAppId: 1172620,
    name: 'Sea of Thieves',
    price: 3999,
    currency: 'USD',
    metadata: { genres: ['Adventure', 'Co-op'], developer: 'Rare', publisher: 'Xbox Game Studios' },
    playerPeak: 211000,
    snapshots: buildSnapshots(20, 3999, 211000, '2024-01-21T00:00:00Z'),
  },
  {
    steamAppId: 275850,
    name: "No Man's Sky",
    price: 2999,
    currency: 'USD',
    metadata: { genres: ['Adventure', 'Space'], developer: 'Hello Games', publisher: 'Hello Games' },
    playerPeak: 212000,
    snapshots: buildSnapshots(20, 2999, 212000, '2024-01-22T00:00:00Z'),
  },
  {
    steamAppId: 221100,
    name: 'DayZ',
    price: 3999,
    currency: 'USD',
    metadata: { genres: ['Survival', 'Multiplayer'], developer: 'Bohemia Interactive', publisher: 'Bohemia Interactive' },
    playerPeak: 45000,
    snapshots: buildSnapshots(20, 3999, 45000, '2024-01-23T00:00:00Z'),
  },
  {
    steamAppId: 227300,
    name: 'Euro Truck Simulator 2',
    price: 1999,
    currency: 'USD',
    metadata: { genres: ['Simulation', 'Driving'], developer: 'SCS Software', publisher: 'SCS Software' },
    playerPeak: 60000,
    snapshots: buildSnapshots(20, 1999, 60000, '2024-01-24T00:00:00Z'),
  },
  {
    steamAppId: 270880,
    name: 'American Truck Simulator',
    price: 1999,
    currency: 'USD',
    metadata: { genres: ['Simulation', 'Driving'], developer: 'SCS Software', publisher: 'SCS Software' },
    playerPeak: 35000,
    snapshots: buildSnapshots(20, 1999, 35000, '2024-01-25T00:00:00Z'),
  },
  {
    steamAppId: 255710,
    name: 'Cities: Skylines',
    price: 2999,
    currency: 'USD',
    metadata: { genres: ['City Builder', 'Strategy'], developer: 'Colossal Order', publisher: 'Paradox Interactive' },
    playerPeak: 60000,
    snapshots: buildSnapshots(20, 2999, 60000, '2024-01-26T00:00:00Z'),
  },
  {
    steamAppId: 949230,
    name: 'Cities: Skylines II',
    price: 5999,
    currency: 'USD',
    metadata: { genres: ['City Builder', 'Strategy'], developer: 'Colossal Order', publisher: 'Paradox Interactive' },
    playerPeak: 100000,
    snapshots: buildSnapshots(20, 5999, 100000, '2024-01-27T00:00:00Z'),
  },
  {
    steamAppId: 1966720,
    name: 'Lethal Company',
    price: 999,
    currency: 'USD',
    metadata: { genres: ['Horror', 'Co-op'], developer: 'Zeekerss', publisher: 'Zeekerss' },
    playerPeak: 240000,
    snapshots: buildSnapshots(20, 999, 240000, '2024-01-28T00:00:00Z'),
  },
  {
    steamAppId: 739630,
    name: 'Phasmophobia',
    price: 1399,
    currency: 'USD',
    metadata: { genres: ['Horror', 'Co-op'], developer: 'Kinetic Games', publisher: 'Kinetic Games' },
    playerPeak: 112000,
    snapshots: buildSnapshots(20, 1399, 112000, '2024-01-29T00:00:00Z'),
  },
  {
    steamAppId: 381210,
    name: 'Dead by Daylight',
    price: 1999,
    currency: 'USD',
    metadata: { genres: ['Horror', 'Multiplayer'], developer: 'Behaviour Interactive', publisher: 'Behaviour Interactive' },
    playerPeak: 250000,
    snapshots: buildSnapshots(20, 1999, 250000, '2024-01-30T00:00:00Z'),
  },
  {
    steamAppId: 892970,
    name: 'Valheim',
    price: 1999,
    currency: 'USD',
    metadata: { genres: ['Survival', 'Co-op'], developer: 'Iron Gate', publisher: 'Coffee Stain Publishing' },
    playerPeak: 500000,
    snapshots: buildSnapshots(20, 1999, 500000, '2024-01-31T00:00:00Z'),
  },
  {
    steamAppId: 105600,
    name: 'Terraria',
    price: 999,
    currency: 'USD',
    metadata: { genres: ['Sandbox', 'Adventure'], developer: 'Re-Logic', publisher: 'Re-Logic' },
    playerPeak: 486000,
    snapshots: buildSnapshots(20, 999, 486000, '2024-02-01T00:00:00Z'),
  },
  {
    steamAppId: 413150,
    name: 'Stardew Valley',
    price: 1499,
    currency: 'USD',
    metadata: { genres: ['Simulation', 'RPG'], developer: 'ConcernedApe', publisher: 'ConcernedApe' },
    playerPeak: 94000,
    snapshots: buildSnapshots(20, 1499, 94000, '2024-02-02T00:00:00Z'),
  },
  {
    steamAppId: 1145360,
    name: 'Hades',
    price: 2499,
    currency: 'USD',
    metadata: { genres: ['Action', 'Rogue-lite'], developer: 'Supergiant Games', publisher: 'Supergiant Games' },
    playerPeak: 44400,
    snapshots: buildSnapshots(20, 2499, 44400, '2024-02-03T00:00:00Z'),
  },
  {
    steamAppId: 646570,
    name: 'Slay the Spire',
    price: 2499,
    currency: 'USD',
    metadata: { genres: ['Card Battler', 'Rogue-like'], developer: 'MegaCrit', publisher: 'MegaCrit' },
    playerPeak: 33000,
    snapshots: buildSnapshots(20, 2499, 33000, '2024-02-04T00:00:00Z'),
  },
  {
    steamAppId: 264710,
    name: 'Subnautica',
    price: 2999,
    currency: 'USD',
    metadata: { genres: ['Survival', 'Adventure'], developer: 'Unknown Worlds', publisher: 'Unknown Worlds' },
    playerPeak: 40000,
    snapshots: buildSnapshots(20, 2999, 40000, '2024-02-05T00:00:00Z'),
  },
  {
    steamAppId: 294100,
    name: 'RimWorld',
    price: 3499,
    currency: 'USD',
    metadata: { genres: ['Simulation', 'Strategy'], developer: 'Ludeon Studios', publisher: 'Ludeon Studios' },
    playerPeak: 50000,
    snapshots: buildSnapshots(20, 3499, 50000, '2024-02-06T00:00:00Z'),
  },
  {
    steamAppId: 427520,
    name: 'Factorio',
    price: 3499,
    currency: 'USD',
    metadata: { genres: ['Automation', 'Strategy'], developer: 'Wube Software', publisher: 'Wube Software' },
    playerPeak: 78000,
    snapshots: buildSnapshots(20, 3499, 78000, '2024-02-07T00:00:00Z'),
  },
  {
    steamAppId: 440,
    name: 'Team Fortress 2',
    price: 0,
    currency: 'USD',
    metadata: { genres: ['FPS', 'Multiplayer'], developer: 'Valve', publisher: 'Valve' },
    playerPeak: 150000,
    snapshots: buildSnapshots(20, 0, 150000, '2024-02-08T00:00:00Z'),
  },
  {
    steamAppId: 620,
    name: 'Portal 2',
    price: 999,
    currency: 'USD',
    metadata: { genres: ['Puzzle', 'Co-op'], developer: 'Valve', publisher: 'Valve' },
    playerPeak: 130000,
    snapshots: buildSnapshots(20, 999, 130000, '2024-02-09T00:00:00Z'),
  },
  {
    steamAppId: 550,
    name: 'Left 4 Dead 2',
    price: 999,
    currency: 'USD',
    metadata: { genres: ['Co-op', 'Shooter'], developer: 'Valve', publisher: 'Valve' },
    playerPeak: 162000,
    snapshots: buildSnapshots(20, 999, 162000, '2024-02-10T00:00:00Z'),
  },
  {
    steamAppId: 945360,
    name: 'Among Us',
    price: 499,
    currency: 'USD',
    metadata: { genres: ['Party', 'Multiplayer'], developer: 'Innersloth', publisher: 'Innersloth' },
    playerPeak: 447000,
    snapshots: buildSnapshots(20, 499, 447000, '2024-02-11T00:00:00Z'),
  },
  {
    steamAppId: 782330,
    name: 'DOOM Eternal',
    price: 5999,
    currency: 'USD',
    metadata: { genres: ['FPS', 'Action'], developer: 'id Software', publisher: 'Bethesda Softworks' },
    playerPeak: 104000,
    snapshots: buildSnapshots(20, 5999, 104000, '2024-02-12T00:00:00Z'),
  },
  {
    steamAppId: 2050650,
    name: 'Resident Evil 4',
    price: 5999,
    currency: 'USD',
    metadata: { genres: ['Horror', 'Action'], developer: 'Capcom', publisher: 'Capcom' },
    playerPeak: 168000,
    snapshots: buildSnapshots(20, 5999, 168000, '2024-02-13T00:00:00Z'),
  },
  {
    steamAppId: 1196590,
    name: 'Resident Evil Village',
    price: 5999,
    currency: 'USD',
    metadata: { genres: ['Horror', 'Action'], developer: 'Capcom', publisher: 'Capcom' },
    playerPeak: 106000,
    snapshots: buildSnapshots(20, 5999, 106000, '2024-02-14T00:00:00Z'),
  },
  {
    steamAppId: 208650,
    name: 'Batman: Arkham Knight',
    price: 1999,
    currency: 'USD',
    metadata: { genres: ['Action', 'Open World'], developer: 'Rocksteady Studios', publisher: 'WB Games' },
    playerPeak: 25000,
    snapshots: buildSnapshots(20, 1999, 25000, '2024-02-15T00:00:00Z'),
  },
  {
    steamAppId: 1240440,
    name: 'Halo Infinite',
    price: 0,
    currency: 'USD',
    metadata: { genres: ['FPS', 'Multiplayer'], developer: '343 Industries', publisher: 'Xbox Game Studios' },
    playerPeak: 272000,
    snapshots: buildSnapshots(20, 0, 272000, '2024-02-16T00:00:00Z'),
  },
  {
    steamAppId: 1551360,
    name: 'Forza Horizon 5',
    price: 5999,
    currency: 'USD',
    metadata: { genres: ['Racing', 'Open World'], developer: 'Playground Games', publisher: 'Xbox Game Studios' },
    playerPeak: 81000,
    snapshots: buildSnapshots(20, 5999, 81000, '2024-02-17T00:00:00Z'),
  },
  {
    steamAppId: 489830,
    name: 'The Elder Scrolls V: Skyrim Special Edition',
    price: 3999,
    currency: 'USD',
    metadata: { genres: ['RPG', 'Open World'], developer: 'Bethesda Game Studios', publisher: 'Bethesda Softworks' },
    playerPeak: 140000,
    snapshots: buildSnapshots(20, 3999, 140000, '2024-02-18T00:00:00Z'),
  },
  {
    steamAppId: 377160,
    name: 'Fallout 4',
    price: 1999,
    currency: 'USD',
    metadata: { genres: ['RPG', 'Open World'], developer: 'Bethesda Game Studios', publisher: 'Bethesda Softworks' },
    playerPeak: 472000,
    snapshots: buildSnapshots(20, 1999, 472000, '2024-02-19T00:00:00Z'),
  },
];

const USER_SEEDS: UserSeed[] = [
  {
    steamId: '76561198000000001',
    username: 'alice',
    avatarUrl: 'https://example.com/avatars/alice.png',
    prices: [
      { steamAppId: 570, povPrice: 0 },
      { steamAppId: 578080, povPrice: 2799 },
    ],
  },
  {
    steamId: '76561198000000002',
    username: 'bob',
    avatarUrl: 'https://example.com/avatars/bob.png',
    prices: [
      { steamAppId: 730, povPrice: 0 },
      { steamAppId: 1245620, povPrice: 4599 },
    ],
  },
];

/**
 * Seeds deterministic data for games, snapshots, users, and user prices.
 */
export class DatabaseSeeder extends Seeder {
  /**
   * Inserts sample data across all tables to enable local simulations.
   */
  public async run(em: EntityManager): Promise<void> {
    await this.clearDatabase(em);
    const games = this.createGames(em, GAME_SEEDS);
    const users = this.createUsers(em, USER_SEEDS);
    this.createSnapshots(em, games, GAME_SEEDS);
    this.createUserPrices(em, users, games, USER_SEEDS);
    await em.flush();
  }

  private async clearDatabase(em: EntityManager): Promise<void> {
    await em.nativeDelete(UserPriceEntity, {});
    await em.nativeDelete(GameSnapshotEntity, {});
    await em.nativeDelete(UserEntity, {});
    await em.nativeDelete(GameEntity, {});
  }

  private createGames(em: EntityManager, seeds: GameSeed[]): Map<number, GameEntity> {
    const games = new Map<number, GameEntity>();
    const now = new Date();
    seeds.forEach((seed) => {
      const game = em.create(GameEntity, {
        steamAppId: seed.steamAppId,
        name: seed.name,
        price: seed.price,
        currency: seed.currency,
        metadata: seed.metadata ?? null,
        playerPeak: seed.playerPeak,
        createdAt: now,
        updatedAt: now,
      });
      em.persist(game);
      games.set(seed.steamAppId, game);
    });
    return games;
  }

  private createUsers(em: EntityManager, seeds: UserSeed[]): Map<string, UserEntity> {
    const users = new Map<string, UserEntity>();
    const now = new Date();
    seeds.forEach((seed) => {
      const user = em.create(UserEntity, {
        steamId: seed.steamId,
        username: seed.username,
        avatarUrl: seed.avatarUrl,
        createdAt: now,
        updatedAt: now,
      });
      em.persist(user);
      users.set(seed.steamId, user);
    });
    return users;
  }

  private createSnapshots(
    em: EntityManager,
    games: Map<number, GameEntity>,
    seeds: GameSeed[],
  ): void {
    seeds.forEach((seed) => {
      const game = games.get(seed.steamAppId);
      if (!game) {
        return;
      }
      seed.snapshots.forEach((snapshot) => {
        const snapshotEntity = em.create(GameSnapshotEntity, {
          game,
          price: snapshot.price,
          playerPeak: snapshot.playerPeak,
          date: snapshot.date,
          createdAt: snapshot.date,
          updatedAt: snapshot.date,
        });
        em.persist(snapshotEntity);
      });
    });
  }

  private createUserPrices(
    em: EntityManager,
    users: Map<string, UserEntity>,
    games: Map<number, GameEntity>,
    seeds: UserSeed[],
  ): void {
    seeds.forEach((seed) => {
      const user = users.get(seed.steamId);
      if (!user) {
        return;
      }
      seed.prices.forEach((priceSeed) => {
        const game = games.get(priceSeed.steamAppId);
        if (!game) {
          return;
        }
        const userPrice = em.create(UserPriceEntity, {
          user,
          game,
          povPrice: priceSeed.povPrice,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        em.persist(userPrice);
      });
    });
  }
}
