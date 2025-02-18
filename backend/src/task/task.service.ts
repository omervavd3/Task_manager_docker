import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

type UserPayload = {
  id: string;
  email: string;
};

@Injectable()
export class TaskService {
  constructor(
    @Inject('TASK_REPOSITORY')
    private taskRepository: Repository<Task>,
  ) {}

  async getAll(userId?: string) {
    try {
      if (userId) {
        const userById = await this.taskRepository.find({ where: { userId } });
        return userById;
      } else {
        return await this.taskRepository.find();
      }
    } catch (error) {
      throw new NotFoundException('Something went wrong');
    }
  }

  async getOne(id: string) {
    try {
      const task = await this.taskRepository.findOne({ where: { id: +id } });
      if (task) {
        return task;
      } else {
        throw new NotFoundException('Task not found by ID');
      }
    } catch (error) {
      throw error
    }
  }

  async create(task: CreateTaskDto, userPayload: UserPayload) {
    try {
      const userId = userPayload.id;
      task.userId = userId;
      return await this.taskRepository.save(task);
    } catch (error) {
      throw error
    }
  }

  async updateOne(id: string, task: UpdateTaskDto, userPayload: UserPayload) {
    try {
      const taskToUpdate = await this.taskRepository.findOne({
        where: { id: +id },
      });
      if (!taskToUpdate) {
        throw new NotFoundException('Task not found for update');
      }
      if (taskToUpdate.userId != userPayload.id) {
        throw new NotFoundException('User not allowed to update this task');
      }
      await this.taskRepository.update({ id: +id }, task);
      return `Task updated`;
    } catch (error) {
      throw error
    }
  }

  async deleteByUser(userPayload: UserPayload) {
    try {
      const taskToDelete = await this.taskRepository.find({
        where: { userId: userPayload.id },
      });
      if (!taskToDelete || !taskToDelete[0]) {
        return `No tasks to delete`;
      }
      taskToDelete.forEach(async (task) => {
        await this.taskRepository.delete({ id: task.id });
      });
      return `Tasks deleted`;
    } catch (error) {
      throw new BadRequestException();
    }
  }

    async deleteByTaskId(id: string, userPayload: UserPayload) {
        try {
        const taskToDelete = await this.taskRepository.findOne({
            where: { id: +id },
        });
        if (!taskToDelete) {
            throw new NotFoundException('Task not found for delete');
        }
        if (taskToDelete.userId != userPayload.id) {
            throw new NotFoundException('User not allowed to delete this task');
        }
        await this.taskRepository.delete({ id: +id });
        return `Task deleted`;
        } catch (error) {
        throw error
        }
    }
}
