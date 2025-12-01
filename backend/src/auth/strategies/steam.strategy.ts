import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-steam';

import { AuthService } from '../auth.service';
import { AuthUserPayload } from '../types/auth-user.payload';

@Injectable()
export class SteamStrategy extends PassportStrategy(Strategy, 'steam') {
  constructor(private readonly authService: AuthService) {
    super({
      returnURL: process.env.STEAM_RETURN_URL ?? 'http://localhost:3000/api/auth/steam/callback',
      realm: process.env.STEAM_REALM ?? 'http://localhost:3000',
      apiKey: process.env.STEAM_API_KEY ?? '',
    });
  }

  public async validate(
    identifier: string,
    profile: { _json?: { steamid?: string; personaname?: string; avatarfull?: string } },
  ): Promise<AuthUserPayload> {
    const steamId = profile._json?.steamid ?? identifier;
    const displayName = profile._json?.personaname ?? 'steam-user';
    const avatar = profile._json?.avatarfull ?? '';
    return this.authService.validateSteamProfile({
      id: steamId,
      displayName,
      photos: avatar ? [{ value: avatar }] : [],
    });
  }
}
