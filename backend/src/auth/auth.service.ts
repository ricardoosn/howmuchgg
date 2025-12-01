import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { AuthUserPayload } from './types/auth-user.payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async validateSteamProfile(profile: {
    id: string;
    displayName: string;
    photos?: Array<{ value: string }>;
  }): Promise<AuthUserPayload> {
    const avatarUrl = profile.photos && profile.photos[0] ? profile.photos[0].value : '';
    return this.usersService.upsertSteamUser(profile.id, profile.displayName, avatarUrl);
  }

  public createSessionToken(user: AuthUserPayload): string {
    return this.jwtService.sign({
      sub: user.id,
      steamId: user.steamId,
      username: user.username,
      avatarUrl: user.avatarUrl,
    });
  }
}
