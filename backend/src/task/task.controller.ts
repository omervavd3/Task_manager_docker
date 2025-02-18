import {
  Controller,
  Param,
  Post,
  Get,
  Query,
  Body,
  ValidationPipe,
  Patch,
  Delete,
  HttpCode,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guards';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({ summary: 'Get all tasks' })
  @Get() // Get /task or /task?userId=1234
  @HttpCode(200)
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filter tasks by userId',
  })
  @ApiOkResponse({ description: 'Tasks retrieved successfully' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'No tasks found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  getAll(@Query('userId') userId?: string) {
    return this.taskService.getAll(userId);
  }

  @ApiOperation({ summary: 'Get task by ID' })
  @Get(':id') // Get task by id /task/:id
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Task ID',
  })
  @HttpCode(200)
  @ApiOkResponse({ description: 'Task retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiBadRequestResponse({ description: 'Invalid task ID format' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getOne(@Param('id') id: string) {
    return this.taskService.getOne(id);
  }

  @ApiOperation({ summary: 'Create a task' })
  @Post() // Create task /task
  @HttpCode(201)
  @ApiCreatedResponse({ description: 'Task created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid task data provided' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBearerAuth()
  @ApiBody({
    type: CreateTaskDto,
    description: 'Task data',
  })
  @UseGuards(AuthGuard)
  create(@Body(ValidationPipe) task: CreateTaskDto, @Request() req) {
    return this.taskService.create(task, req.user);
  }

  @ApiOperation({ summary: 'Update a task, in this project toggles complition' })
  @Patch(':id') // Update task by id /task/:id
  @HttpCode(200)
  @ApiOkResponse({ description: 'Task updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid update data or task ID' })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBearerAuth()
  @ApiBody({
    description: 'Task data to update',
    type: UpdateTaskDto,
    schema: {
      example: {
        isCompleted: true,
      },
    },
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Task ID',
  })
  @UseGuards(AuthGuard)
  updateOne(
    @Param('id') id: string,
    @Body(ValidationPipe) task: UpdateTaskDto,
    @Request() req,
  ) {
    return this.taskService.updateOne(id, task, req.user);
  }

  @ApiOperation({ summary: 'Delete all tasks for a user' })
  @Delete('/deleteByUser') // Delete task by user /task/deleteByUser
  @HttpCode(200)
  @ApiOkResponse({ description: 'All tasks deleted successfully for user' })
  @ApiNotFoundResponse({ description: 'No tasks found for the user' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBearerAuth() 
  @UseGuards(AuthGuard)
  deleteOne(@Request() req) {
    return this.taskService.deleteByUser(req.user);
  }

  @ApiOperation({ summary: 'Delete a task by ID' })
  @Delete(':id') // Delete task by id /task/:id
  @HttpCode(200)
  @ApiOkResponse({ description: 'Task deleted successfully' })
  @ApiBadRequestResponse({ description: 'Invalid task ID format' })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBearerAuth() 
  @UseGuards(AuthGuard)
  deleteByTaskId(@Param('id') id: string, @Request() req) {
    return this.taskService.deleteByTaskId(id, req.user);
  }
}
