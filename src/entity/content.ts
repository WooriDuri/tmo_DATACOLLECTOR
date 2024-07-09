import { BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class EntityContent extends BaseEntity {
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
