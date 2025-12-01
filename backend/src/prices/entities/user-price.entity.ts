import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';

import { BaseEntity } from '../../shared/entities/base.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { GameEntity } from '../../games/entities/game.entity';

@Entity({ tableName: 'user_prices' })
@Unique({ properties: ['user', 'game'] })
export class UserPriceEntity extends BaseEntity {
  @ManyToOne(() => UserEntity)
  public user!: UserEntity;

  @ManyToOne(() => GameEntity)
  public game!: GameEntity;

  @Property({ fieldName: 'pov_price', type: 'number' })
  public povPrice!: number;
}
