import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { EntityContent } from './content';
import { Champion } from './champion.entity';

@Entity({ name: 'champSkill' })
export class ChampSkillEntity extends EntityContent {
  @Column({ type: 'int', nullable: false })
  champ_id: number;

  @Column({ type: 'int', nullable: false })
  vs_champ_id: number;

  @Column('simple-array', { nullable: false })
  skills: number[];

  @ManyToOne(() => Champion, (champion) => champion.champSkills)
  @JoinColumn({ name: 'champ_id' })
  champion: Champion;

  @ManyToOne(() => Champion, (champion) => champion.vsChampSkills)
  @JoinColumn({ name: 'vs_champ_id' })
  vsChampion: Champion;
}
