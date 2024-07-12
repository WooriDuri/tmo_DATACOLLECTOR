import { Champion } from 'src/entity/champion.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityContent } from './content';

@Entity({ name: 'championWin' })
export class ChampionWinEntity extends EntityContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  champ_id: number;

  @Column({ type: 'int', nullable: false })
  vs_champ_id: number;

  @Column({ type: 'boolean', nullable: false })
  win: boolean;

  @ManyToOne(() => Champion, (champion) => champion.champWins)
  @JoinColumn({ name: 'champ_id' })
  champion: Champion;

  @ManyToOne(() => Champion, (champion) => champion.vsChampWins)
  @JoinColumn({ name: 'vs_champ_id' })
  vsChampion: Champion;
}
