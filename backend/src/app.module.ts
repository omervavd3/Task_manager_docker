import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { TaskModule } from './task/task.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, DatabaseModule, TaskModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
