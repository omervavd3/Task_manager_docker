import {
  Injectable,
  Inject,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

type UserPayload = {
  id: string;
  email: string;
};

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async getAll(name?: string) {
    if (name) {
      const userByName = await this.userRepository.find({ where: { name } });
      if (userByName.length > 0) {
        return userByName;
      } else {
        throw new NotFoundException('Name not found');
      }
    } else {
      return await this.userRepository.find();
    }
  }

  async getOneByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async getOne(id: string) {
    return await this.userRepository.findOne({ where: { id: +id } });
  }

  async register(user: CreateUserDto) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      user.password = hashedPassword;
      user.token = '';
      return await this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          const accessToken = await this.jwtService.sign(
            { id: user.id, email: user.email },
            { secret: process.env.JWT_SECRET },
          );
          user.token = accessToken;
          await this.userRepository.save(user);
          return { accessToken, userId: user.id, userName: user.name };
        } else {
          throw new UnauthorizedException('Invalid credentials');
        }
      } else {
        throw new NotFoundException('User not found');
      }
    } catch (error) {
      throw error;
    }
  }

  async logout(userPayload: UserPayload) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: userPayload.email },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      user.token = '';
      await this.userRepository.save(user);
      return 'Logged out';
    } catch (error) {
      throw error;
    }
  }

  async delete(userPayload: UserPayload) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: userPayload.email },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (user.id != +userPayload.id) {
        throw new NotFoundException('User not allowed to delete this user');
      }
      await this.userRepository.delete(user.id);
      return 'User deleted';
    } catch (error) {
      throw error;
    }
  }

  async updateOne(
    id: string,
    updateUser: UpdateUserDto,
    userPayload: UserPayload,
  ) {
    try {
      const userToUpdate = await this.userRepository.findOne({
        where: { id: +id },
      });
      if (!userToUpdate) {
        throw new NotFoundException('User not found for update');
      }
      if (userToUpdate.id != +userPayload.id) {
        throw new NotFoundException('User not allowed to update this user');
      }
      await this.userRepository.update({ id: +id }, updateUser);
      const newUpdateUser = await this.userRepository.findOne({
        where: { id: +id },
      });
      return `User ${newUpdateUser?.name} updated`;
    } catch (error) {
      throw error;
    }
  }
}
