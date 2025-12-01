import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { AuthenticatedRequest } from '../auth/types/authenticated-request.type';
import { ProfileResponseDto } from './dto/profile-response.dto';

@ApiTags('Profile')
@Controller('profile')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get authenticated user profile with submitted prices' })
  @ApiOkResponse({ type: ProfileResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiCookieAuth('connect.sid')
  @Get('me')
  @UseGuards(AuthGuard('jwt-session'))
  public async getProfile(@Req() request: AuthenticatedRequest): Promise<ProfileResponseDto> {
    if (!request.user) {
      throw new Error('Authenticated user not found in request');
    }
    return this.usersService.findProfileWithPrices(request.user.id);
  }
}
