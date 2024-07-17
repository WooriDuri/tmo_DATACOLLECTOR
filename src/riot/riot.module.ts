import { Module } from '@nestjs/common';
import { RiotController } from './riot.controller';
import { RiotService } from './riot.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 1000,
        maxRedirects: 3,
      }),
    }),
  ],
  controllers: [RiotController],
  providers: [RiotService],
})
export class RiotModule {}
