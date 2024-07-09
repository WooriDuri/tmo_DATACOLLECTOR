import { Column, Entity, PrimaryColumn } from 'typeorm';
import { EntityContent } from './content';

@Entity({ name: 'champion' })
export class Champion extends EntityContent {
  @PrimaryColumn()
  champ_id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;
  @Column({ type: 'varchar', nullable: false })
  e_name: string;
}
