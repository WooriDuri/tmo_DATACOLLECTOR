import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { EntityContent } from './content';
import { ChampItemEntity } from './champ_item.entity';

@Entity({ name: 'item' })
export class ItemEntity extends EntityContent {
  @PrimaryColumn()
  item_id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;
  @Column({ type: 'tinyint', nullable: false })
  into: number;

  @Column({ type: 'int', nullable: true })
  gold: number;

  @OneToMany(() => ChampItemEntity, (champItem) => champItem.item)
  champItems: ChampItemEntity[];
}
