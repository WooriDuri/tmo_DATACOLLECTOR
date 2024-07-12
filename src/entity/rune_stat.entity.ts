import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Champion } from './champion.entity';

@Entity({ name: 'runeStat' })
export class RuneStatEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'int', nullable: false })
  champ_id: number;

  @Column({ type: 'int', nullable: false })
  offense: number;

  @Column({ type: 'int', nullable: false })
  defense: number;

  @Column({ type: 'int', nullable: false })
  flex: number;

  @ManyToOne(() => Champion, (champion) => champion.champ)
  @JoinColumn({ name: 'champ_id' })
  champion: Champion;
}
