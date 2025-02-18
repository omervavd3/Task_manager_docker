import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guards';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get all users, can be filtered by name' })
  @Get() //Get /user or /user?name=John
  @HttpCode(200)
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter users by name',
  })
  @ApiOkResponse({ description: 'Get all users, with filter if added' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getAll(@Query('name') name?: string) {
    return this.userService.getAll(name);
  }

  @ApiOperation({ summary: 'Get a user by id' })
  @Get(':id') //Get user by id /user/:id
  @HttpCode(200)
  @ApiOkResponse({ description: 'Get a user by id' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'User ID',
  })
  getOne(@Param('id') id: string) {
    return this.userService.getOne(id);
  }

  @ApiOperation({ summary: 'Register a new user' })
  @Post('/register') //Register user /user/register
  @HttpCode(201)
  @ApiCreatedResponse({ description: 'Register a user' })
  @ApiBadRequestResponse({ description: 'User with this name or email alredy exists' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBody({
    description: 'Sign Up credentials',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'example@email.com' },
        name: { type: 'string', example: 'Guy' },
        password: { type: 'string', example: 'password123' },
      },
    },
  })
  register(@Body(ValidationPipe) user: CreateUserDto) {
    return this.userService.register(user);
  }

  @ApiOperation({ summary: 'Login a user' })
  @Post('/login') //Login user /user/login
  @HttpCode(200)
  @ApiOkResponse({ description: 'Login a user' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBody({
    description: 'Login credentials (email and password)',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'example@email.com' },
        password: { type: 'string', example: 'password123' },
      },
    },
  })
  login(@Body('email') email: string, @Body('password') password: string) {
    return this.userService.login(email, password);
  }

  @ApiOperation({ summary: 'Logout a user' })
  @HttpCode(200)
  @ApiOkResponse({ description: 'Logout a user' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  logout(@Request() req) {
    return this.userService.logout(req.user);
  }

  @ApiOperation({ summary: 'Delete a user' })
  @HttpCode(200)
  @ApiOkResponse({ description: 'Delete a user' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Delete('delete')
  delete(@Request() req) {
    return this.userService.delete(req.user);
  }

  // @Patch(':id') //Update user by id /user/:id
  // @HttpCode(200)
  // @ApiOkResponse({ description: 'Update a user by id' })
  // @ApiBadRequestResponse({ description: 'Bad request' })
  // @ApiNotFoundResponse({ description: 'User not found' })
  // @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard)
  // updateOne(
  //   @Param('id') id: string,
  //   @Body(ValidationPipe) updateUser: UpdateUserDto,
  //   @Request() req,
  // ) {
  //   return this.userService.updateOne(id, updateUser, req.user);
  // }
}
