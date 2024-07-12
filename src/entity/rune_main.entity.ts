import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityContent } from './content';
import { Champion } from './champion.entity';

@Entity({ name: 'runeMain' })
export class RuneMainEntity extends EntityContent {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'int', nullable: false })
  champ_id: number;

  @Column({ type: 'int', nullable: false })
  vs_champ_id: number;

  @Column('simple-array', { nullable: false })
  primary_rune: number[];

  @Column({ type: 'int', nullable: false })
  primary_style: number;

  @Column('simple-array', { nullable: false })
  secondary_rune: number[];

  @Column({ type: 'int', nullable: false })
  secondary_style: number;

  @ManyToOne(() => Champion, (champion) => champion.runeMains)
  @JoinColumn({ name: 'champ_id' })
  champion: Champion;

  @ManyToOne(() => Champion, (champion) => champion.vsRuneMains)
  @JoinColumn({ name: 'vs_champ_id' })
  vsChampion: Champion;
}
