
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
        port: 5432,
        username: 'postgres',
        password: '01051998',
        database: 'task-manager',
        entities: [User, Task],
        synchronize: true, //only for development*******
      });

      return dataSource.initialize();
    },
  },
];
