# Authentication Infrastructure Documentation

## Overview
This document explains how to use the authentication infrastructure setup for the Egyptian National Railways backend application.

## Components

### 1. JWT Configuration (`src/config/jwt.config.ts`)
Contains JWT secret and token expiration settings:
- **Access Token**: Expires in 1 hour
- **Refresh Token**: Expires in 7 days

### 2. Response Format
All API responses follow this unified structure:

```typescript
{
  data: any | any[],      // Your response data
  status: 'Success' | 'Fail',
  message?: string        // Optional message
}
```

### 3. Authentication Guard (`@UseGuards(JwtAuthGuard)`)
Protects routes that require authentication.

```typescript
@UseGuards(JwtAuthGuard)
@Get('profile')
async getProfile(@Req() req) {
  return { data: req.user };
}
```

### 4. Public Routes (`@Public()`)
Mark routes as public (no authentication required):

```typescript
@Public()
@Get('public-data')
getData() {
  return { data: 'Public information' };
}
```

## Usage Examples

### Protecting Routes
By default, **ALL routes are protected** due to the global JWT guard. To make a route public, use `@Public()`:

```typescript
import { Controller, Get } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';

@Controller('api')
export class MyController {
  // This route requires authentication
  @Get('protected')
  getProtectedData() {
    return { data: 'Secret data' };
  }

  // This route is public
  @Public()
  @Get('public')
  getPublicData() {
    return { data: 'Public data' };
  }
}
```

### Generating Tokens
Use `AuthService` to generate JWT tokens:

```typescript
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(private authService: AuthService) {}

  async login(user: User) {
    const tokens = this.authService.generateTokens({
      sub: user.id,
      email: user.email,
    });
    
    return tokens; // { accessToken: '...', refreshToken: '...' }
  }
}
```

### Testing Endpoints

#### 1. Generate a Test Token
```bash
POST http://localhost:3000/auth/test-login
Content-Type: application/json

{
  "email": "test@example.com",
  "userId": "123456"
}
```

Response:
```json
{
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  },
  "status": "Success",
  "message": "Token generated successfully"
}
```

#### 2. Access Protected Route
```bash
GET http://localhost:3000/auth/profile
Authorization: Bearer eyJhbGc...
```

Response:
```json
{
  "data": {
    "userId": "123456",
    "email": "test@example.com"
  },
  "status": "Success",
  "message": "Profile retrieved successfully"
}
```

#### 3. Access Public Route
```bash
GET http://localhost:3000/auth/public
```

Response (no token required):
```json
{
  "data": {
    "message": "This is public data"
  },
  "status": "Success"
}
```

## Response Interceptor
The `ResponseInterceptor` automatically wraps all responses in the unified format:

```typescript
// Your controller returns:
return { name: 'John' };

// Automatically transformed to:
{
  data: { name: 'John' },
  status: 'Success'
}
```

## Serialization Interceptor
Use `SerializationInterceptor` to exclude sensitive fields from responses:

```typescript
import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  // password will be excluded (no @Expose decorator)
  password: string;
}

// Apply to route:
@UseInterceptors(new SerializationInterceptor(UserDto))
@Get('user')
getUser() {
  return user; // password will be automatically removed
}
```

## Security Notes

⚠️ **Important for Production:**
1. Move JWT secret to environment variables (`.env` file)
2. Use stronger secrets (minimum 32 characters)
3. Configure CORS properly in `main.ts`
4. Implement refresh token rotation
5. Add rate limiting to prevent brute force attacks

## Folder Structure
```
src/
├── common/
│   ├── decorators/
│   │   └── public.decorator.ts
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   ├── interceptors/
│   │   ├── response.interceptor.ts
│   │   └── serialization.interceptor.ts
│   └── interfaces/
│       └── response.interface.ts
├── config/
│   └── jwt.config.ts
└── modules/
    └── auth/
        ├── strategies/
        │   └── jwt.strategy.ts
        ├── auth.controller.ts
        ├── auth.service.ts
        └── auth.module.ts
```

## Next Steps
- Implement user registration and login
- Add OTP verification
- Create user profile management
- Implement refresh token rotation
- Add role-based access control (RBAC)
