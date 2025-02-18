import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
  Request,
  Delete,
  Query,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Grants access only to allowed user, checks if the user id in param matches access token' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @HttpCode(200)
  @ApiOkResponse({ description: 'Get access' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'User ID',
  })
  getAccess(@Request() req, @Param() userId) {
    return this.authService.getAccess(req.user, userId.id);
  }

  @ApiOperation({ summary: 'Checks if user is logged in' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get()
  @HttpCode(200)
  @ApiOkResponse({ description: 'Logged in' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  isLoggedIn(@Request() req) {
    return this.authService.isLoggedIn(req.user);
  }
}
