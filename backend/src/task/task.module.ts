import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { DatabaseModule } from 'src/database/database.module';
import { taskProviders } from './task.providers';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from 'src/guards/auth.guards';
import { userProviders } from 'src/user/user.providers';

@Module({
  imports: [DatabaseModule, ConfigModule.forRoot()],
  controllers: [TaskController],
  providers: [TaskService, ...taskProviders, JwtService, UserService, ...userProviders],
})
export class TaskModule {}