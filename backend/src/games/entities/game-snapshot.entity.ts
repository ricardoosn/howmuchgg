import { Entity, ManyToOne, Property } from '@mikro-orm/core';

import { BaseEntity } from '../../shared/entities/base.entity';
import { GameEntity } from './game.entity';

@Entity({ tableName: 'game_snapshots' })
export class GameSnapshotEntity extends BaseEntity {
  @ManyToOne(() => GameEntity)
  public game!: GameEntity;

  @Property({ type: 'number' })
  public price!: number;

  @Property({ fieldName: 'player_peak', type: 'number' })
  public playerPeak!: number;

  @Property({ type: 'date' })
  public date!: Date;
}
