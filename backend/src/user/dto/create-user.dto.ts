import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'John Doe', description: 'User name' })
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'password123', description: 'User password' })
    password: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ example: 'example@email.com', description: 'User email' })
    email: string;

    @IsOptional()
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJleGFtcGxlQGVtYWlsLmNvbSIsImlhdCI6MTczOTU0MTAyN30.bP4j3IrbBTtI8FVTBtrMBgmMTvWyddsaQ1LSyLaV5fM', description: 'User token' })
    token?: string;
}