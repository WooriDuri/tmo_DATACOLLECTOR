import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { EntityContent } from './content';
import { ChampItemEntity } from './champ_item.entity';
import { ChampSkillEntity } from './champ_skill.entity';

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

  @OneToMany(() => ChampSkillEntity, (champItem) => champItem.champion)
  champSkills: ChampSkillEntity[];

  @OneToMany(() => ChampSkillEntity, (champItem) => champItem.vsChampion)
  vsChampSkills: ChampSkillEntity[];
}
