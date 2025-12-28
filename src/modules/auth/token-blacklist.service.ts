import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlacklistedToken } from './schemas/blacklisted-token.schema';

@Injectable()
export class TokenBlacklistService {
  constructor(
    @InjectModel(BlacklistedToken.name)
    private readonly blacklistModel: Model<BlacklistedToken>
  ) {}

  async blacklist(jti: string, exp: number): Promise<void> {
    const expiresAt = new Date(exp * 1000);

    await this.blacklistModel.create({
      jti,
      expiresAt
    });
  }

  async isBlacklisted(jti: string): Promise<boolean> {
    const exists = await this.blacklistModel.exists({ jti });
    return Boolean(exists);
  }
}
