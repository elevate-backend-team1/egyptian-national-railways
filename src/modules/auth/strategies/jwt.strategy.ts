import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConfig } from '../../../config/jwt.config';
import { TokenBlacklistService } from '../token-blacklist.service';

export interface JwtPayload {
  sub: string; // User ID
  email: string;
  jti: string; // jwt Id for blackListed token identifier
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly blacklistService: TokenBlacklistService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload.sub || !payload.email || !payload.jti) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // check if token is blacklisted
    const isBlacklisted = await this.blacklistService.isBlacklisted(payload.jti);

    if (isBlacklisted) {
      throw new UnauthorizedException('Token has been logged out');
    }

    // Return user data that will be attached to request.user
    return {
      userId: payload.sub,
      email: payload.email,
      // for blacklist token [logout service]
      jti: payload.jti,
      exp: payload.exp
    };
  }
}
