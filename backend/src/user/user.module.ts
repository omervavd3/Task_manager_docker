import { Delete, MiddlewareConsumer, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { userProviders } from './user.providers';
import { DatabaseModule } from 'src/database/database.module';
import { CheckUserRegisterMiddleware } from 'src/middlewares/user-register.middleware';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [DatabaseModule, ConfigModule.forRoot()],
    controllers: [UserController],
    providers: [UserService, ...userProviders, CheckUserRegisterMiddleware, JwtService],
    exports:[UserService]
})
export class UserModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
        .apply(CheckUserRegisterMiddleware).forRoutes('user/register')
    }
}
