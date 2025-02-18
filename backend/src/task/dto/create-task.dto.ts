import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Task title', description: 'Task title' })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Task description', description: 'Task description' })
  description: string;

  @IsOptional()
  @ApiProperty({ example: '1234', description: 'User ID' })
  userId: string;

  @IsNotEmpty()
  //@IsDate()
  @ApiProperty({ example: '2021-12-31', description: 'Task due date' })
  date: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ example: 'false', description: 'Task completion status' })
  isComplete: boolean;
}
