import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class TempTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Temporary token required');
    }

    const userId = this.validateTempToken(token);
    
    if (!userId) {
      throw new UnauthorizedException('Invalid or expired temporary token');
    }

    // Add userId to request to use it in the controller
    request['userId'] = userId;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private validateTempToken(token: string): string | null {
    try {
      // Same function as in AuthService
      const payload = JSON.parse(Buffer.from(token, 'base64').toString());
      if (payload.type !== 'temp' || payload.exp < Date.now() / 1000) {
        return null;
      }
      return payload.sub;
    } catch {
      return null;
    }
  }
}