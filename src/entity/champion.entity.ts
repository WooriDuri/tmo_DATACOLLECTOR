import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { EntityContent } from './content';
import { ChampItemEntity } from './champ_item.entity';
import { ChampSkillEntity } from './champ_skill.entity';
import { RuneStatEntity } from './rune_stat.entity';
import { RuneMainEntity } from './rune_main.entity';
import { ChampionWinEntity } from './champion_win.entity';

@Entity({ name: 'champion' })
export class Champion extends EntityContent {
  @PrimaryColumn()
  champ_id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;
  @Column({ type: 'varchar', nullable: false })
  e_name: string;

  @OneToMany(() => ChampItemEntity, (champItem) => champItem.champion)
  champItems: ChampItemEntity[];

  @OneToMany(() => ChampItemEntity, (champItem) => champItem.vsChampion)
  vsChampItems: ChampItemEntity[];

  @OneToMany(() => ChampSkillEntity, (chamSkill) => chamSkill.champion)
  champSkills: ChampSkillEntity[];

  @OneToMany(() => ChampSkillEntity, (chamSkill) => chamSkill.vsChampion)
  vsChampSkills: ChampSkillEntity[];

  @OneToMany(() => RuneStatEntity, (champ) => champ.champion)
  champ: RuneStatEntity[];

  @OneToMany(() => RuneMainEntity, (champ) => champ.vsChampion)
  vsRuneMains: RuneMainEntity[];

  @OneToMany(() => RuneMainEntity, (champ) => champ.champion)
  runeMains: RuneMainEntity[];

  @OneToMany(() => ChampionWinEntity, (champ) => champ.vsChampion)
  vsChampWins: ChampionWinEntity[];

  @OneToMany(() => ChampionWinEntity, (champ) => champ.champion)
  champWins: ChampionWinEntity[];
}
