import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from '../../config/jwt.config';

export interface TokenPayload {
  sub: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  /**
   * Generate an access token
   */
  generateAccessToken(payload: TokenPayload): string {
    return this.jwtService.sign(payload, {
      expiresIn: jwtConfig.accessTokenExpiration
    });
  }

  /**
   * Generate a refresh token
   */
  generateRefreshToken(payload: TokenPayload): string {
    return this.jwtService.sign(payload, {
      expiresIn: jwtConfig.refreshTokenExpiration
    });
  }

  /**
   * Verify and decode a token
   */
  async verifyToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Generate both access and refresh tokens
   */
  generateTokens(payload: TokenPayload) {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload)
    };
  }
}
