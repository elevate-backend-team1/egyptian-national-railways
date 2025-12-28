import { Request } from 'express';

export interface AuthRequest extends Request {
  user: {
    userId: string;
    email: string;
    // for blacklist token
    jti: string;
    exp: number;
  };
}
