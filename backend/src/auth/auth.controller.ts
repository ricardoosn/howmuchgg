import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { AuthenticatedRequest } from './types/authenticated-request.type';
import { AuthSuccessResponseDto } from './dto/auth-success-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Redirect user to Steam OpenID login' })
  @Get('steam')
  @UseGuards(AuthGuard('steam'))
  public async redirectToSteam(): Promise<void> {}

  @ApiOperation({ summary: 'Handle Steam OpenID callback and create session token' })
  @ApiOkResponse({ type: AuthSuccessResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('steam/callback')
  @UseGuards(AuthGuard('steam'))
  public async handleSteamCallback(
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ): Promise<void> {
    if (!request.user) {
      response.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const token = this.authService.createSessionToken(request.user);
    if (request.session) {
      request.session.jwt = token;
      request.session.user = request.user;
    }
    response.json({ ok: true, token });
  }
}
