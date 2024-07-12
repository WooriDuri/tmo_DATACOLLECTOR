import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityContent } from './content';
import { Champion } from './champion.entity';
import { ItemEntity } from './item.entity';

@Entity({ name: 'champItem' })
export class ChampItemEntity extends EntityContent {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'int', nullable: false })
  champ_id: number;

  @Column({ type: 'int', nullable: false })
  item_id: number;

  @Column({ type: 'int', nullable: false })
  timestamp: number;

  @Column({ type: 'int', nullable: false })
  vs_champ_id: number;

  @Column({ type: 'varchar', nullable: false })
  type: string;

  @ManyToOne(() => Champion, (champion) => champion.champItems)
  @JoinColumn({ name: 'champ_id' })
  champion: Champion;

  @ManyToOne(() => Champion, (champion) => champion.vsChampItems)
  @JoinColumn({ name: 'vs_champ_id' })
  vsChampion: Champion;

  @ManyToOne(() => ItemEntity, (item) => item.champItems)
  @JoinColumn({ name: 'item_id' })
  item: ItemEntity;
}
