
import { User } from 'src/user/user.entity';
import {Task} from 'src/task/task.entity';
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '01051998',
        database: process.env.DB_NAME || 'task-manager',
        entities: [User, Task],
        synchronize: false, //only for development*******
      });

      return dataSource.initialize();
    },
  },
];
