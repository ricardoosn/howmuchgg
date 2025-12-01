import { Collection, Entity, OneToMany, Property, Unique } from '@mikro-orm/core';

import { BaseEntity } from '../../shared/entities/base.entity';
import { UserPriceEntity } from '../../prices/entities/user-price.entity';

@Entity({ tableName: 'users' })
export class UserEntity extends BaseEntity {
  @Property({ fieldName: 'steam_id', type: 'string' })
  @Unique()
  public steamId!: string;

  @Property({ type: 'string' })
  public username!: string;

  @Property({ fieldName: 'avatar_url', type: 'string' })
  public avatarUrl!: string;

  @OneToMany(() => UserPriceEntity, (userPrice) => userPrice.user)
  public prices = new Collection<UserPriceEntity>(this);
}
