import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'spell' })
export class SpellEntity {
  @PrimaryColumn()
  spell_id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;
}
