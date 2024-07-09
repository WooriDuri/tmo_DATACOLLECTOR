import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({
  path:
    process.env.NODE_ENV === 'prod'
      ? './environment/.env.prod'
      : process.env.NODE_ENV === 'dev'
      ? './environment/.env.dev'
      : './environment/.env.local',
});

const config = {
  type: 'mysql',
  host: process.env.TMO_HOST,
  port: Number(process.env.TMO_PORT),
  username: process.env.TMO_USER,
  password: process.env.TMO_PASSWORD,
  database: process.env.TMO_DATABASE,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: true,
  logging: false,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
