import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

type UserPayload = {
  id: string;
  email: string;
};

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async getAccess(payload: UserPayload, userId: string) {
    try {
      if (payload.id == userId) {
        return true;
      } else {
        throw new UnauthorizedException('Unauthorized');
      }
    } catch (error) {
      throw error;
    }
  }

  async isLoggedIn(payload: UserPayload) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: Number(payload.id) },
      });
      if (user) {
        const data = {
          id: user.id,
          name: user.name,
          email: user.email,
        };
        return data;
      } else {
        throw new NotFoundException('User not found');
      }
    } catch (error) {
      throw error;
    }
  }
}
