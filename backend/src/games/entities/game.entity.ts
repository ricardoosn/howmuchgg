import { Collection, Entity, OneToMany, Property, Unique } from '@mikro-orm/core';

import { BaseEntity } from '../../shared/entities/base.entity';
import { GameSnapshotEntity } from './game-snapshot.entity';
import { UserPriceEntity } from '../../prices/entities/user-price.entity';

@Entity({ tableName: 'games' })
export class GameEntity extends BaseEntity {
  @Property({ fieldName: 'steam_appid', type: 'number' })
  @Unique()
  public steamAppId!: number;

  @Property({ type: 'string' })
  public name!: string;

  @Property({ type: 'number' })
  public price!: number;

  @Property({ type: 'string' })
  public currency!: string;

  @Property({ type: 'json', nullable: true })
  public metadata?: Record<string, unknown> | null;

  @Property({ fieldName: 'player_peak', type: 'number' })
  public playerPeak!: number;

  @OneToMany(() => GameSnapshotEntity, (snapshot) => snapshot.game)
  public snapshots = new Collection<GameSnapshotEntity>(this);

  @OneToMany(() => UserPriceEntity, (price) => price.game)
  public userPrices = new Collection<UserPriceEntity>(this);
}
