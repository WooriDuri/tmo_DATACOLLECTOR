import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  getHello(): string {
    return 'Hello World!';
  }

  async getCache() {
    const test = await this.cacheManager.get('time');
    if (test) {
      return '캐싱 데이터 : ' + test;
    }
    const now = new Date().getTime();
    await this.cacheManager.set('time', now);
    return '캐싱 데이터 : ' + now;
  }
}
