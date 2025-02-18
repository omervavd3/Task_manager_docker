import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    const token = authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
        const secret = this.configService.get<string>('JWT_SECRET'); 
        const payload = await this.jwtService.verifyAsync(token, { secret });
        const user = await this.userService.getOneByEmail(payload.email);
        if (!user) {
            throw new UnauthorizedException('Invalid user');
        }
        if(user.token !== token) {
            throw new UnauthorizedException('Invalid token, no longer usable');
        }
      request.user = {
        id: payload.id,
        email: payload.email,
      };
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
