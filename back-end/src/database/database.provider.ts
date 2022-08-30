
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import config from 'config';

const dbConfig: any = config.get('db');
dotenv.config();

export const DatabaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: dbConfig.type,
        database: process.env.DB_NAME || dbConfig.database,
        entities: [__dirname + '/../**/*.entity.{js,ts}'],
        synchronize: process.env.TYPEORM_SYNC || dbConfig.synchronize
      });

      return dataSource.initialize();
    },
  },
];
