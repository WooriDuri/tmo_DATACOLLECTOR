import { Module, forwardRef } from '@nestjs/common';
import { SkillService } from './skill.service';
import { ChampSkillEntity } from 'src/entity/champ_skill.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';

@Module({
  imports: [
    forwardRef(() => AppModule),
    TypeOrmModule.forFeature([ChampSkillEntity]),
  ],
  providers: [SkillService],
  exports: [SkillService],
})
export class SkillModule {}
