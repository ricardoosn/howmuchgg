import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthUserPayload } from '../types/auth-user.payload';

const sessionExtractor = (request: { session?: { jwt?: string } }): string | null =>
  request.session?.jwt ?? null;

@Injectable()
export class SessionJwtStrategy extends PassportStrategy(Strategy, 'jwt-session') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([sessionExtractor]),
      secretOrKey: process.env.JWT_SECRET ?? 'gameworth_jwt_secret',
      ignoreExpiration: false,
    });
  }

  public async validate(payload: {
    sub: number;
    steamId: string;
    username: string;
    avatarUrl: string;
  }): Promise<AuthUserPayload> {
    return {
      id: payload.sub,
      steamId: payload.steamId,
      username: payload.username,
      avatarUrl: payload.avatarUrl,
    };
  }
}
