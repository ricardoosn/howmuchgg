import { PrimaryKey, Property } from '@mikro-orm/core';

export abstract class BaseEntity {
  @PrimaryKey({ type: 'number' })
  public id!: number;

  @Property({ fieldName: 'created_at', onCreate: () => new Date() })
  public createdAt!: Date;

  @Property({ fieldName: 'updated_at', onUpdate: () => new Date(), onCreate: () => new Date() })
  public updatedAt!: Date;

  @Property({ fieldName: 'deleted_at', nullable: true })
  public deletedAt?: Date | null;
}
