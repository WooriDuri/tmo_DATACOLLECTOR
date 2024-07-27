import { Module, forwardRef } from '@nestjs/common';
import { RiotController } from './riot.controller';
import { RiotService } from './riot.service';
import { HttpModule } from '@nestjs/axios';
import { AppModule } from 'src/app.module';

@Module({
  imports: [
    forwardRef(() => AppModule),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 1000,
        maxRedirects: 3,
      }),
    }),
  ],
  controllers: [RiotController],
  providers: [RiotService],
  exports: [RiotService],
})
export class RiotModule {}
