import { Column, Entity, PrimaryColumn } from 'typeorm';
import { EntityContent } from './content';

@Entity({ name: 'item' })
export class ItemEntity extends EntityContent {
  @PrimaryColumn()
  item_id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;
  @Column({ type: 'tinyint', nullable: false })
  into: number;
}
