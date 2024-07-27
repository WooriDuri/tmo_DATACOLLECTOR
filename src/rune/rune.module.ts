import { Module, forwardRef } from '@nestjs/common';
import { RuneService } from './rune.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RuneMainEntity } from 'src/entity/rune_main.entity';
import { RuneStatEntity } from 'src/entity/rune_stat.entity';
import { AppModule } from 'src/app.module';

@Module({
  imports: [
    forwardRef(() => AppModule),
    TypeOrmModule.forFeature([RuneMainEntity, RuneStatEntity]),
  ],
  providers: [RuneService],
  exports: [RuneService],
})
export class RuneModule {}
