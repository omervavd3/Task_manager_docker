import {
  Injectable,
  NestMiddleware,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CheckUserRegisterMiddleware implements NestMiddleware {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, name } = req.body;

      if (!email || !name) {
        throw new BadRequestException('Email and name are required');
      }

      const existingUser = await this.userRepository.findOne({
        where: [{ email }, { name }],
      });

      if (existingUser) {
        throw new BadRequestException(
          'User with this email or name already exists',
        );
      }

      next();
    } catch (error) {
      throw error;
    }
  }
}
