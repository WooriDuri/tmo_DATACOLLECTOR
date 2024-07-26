import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { ChampSkillEntity } from 'src/entity/champ_skill.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ChampSkillEntity])],
  providers: [SkillService],
})
export class SkillModule {}
