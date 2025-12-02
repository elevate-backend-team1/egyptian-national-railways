import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { IsEmail, IsString } from 'class-validator';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import type { ApiResponse } from '../../common/interfaces/response.interface';
import { ResponseStatus } from '../../common/interfaces/response.interface';

// Sample DTO for testing
class TestLoginDto {
    @IsEmail()
    email: string;

    @IsString()
    userId: string;
}

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    /**
     * Test endpoint to generate a token
     * This is just for testing purposes
     */
    @Public()
    @Post('test-login')
    async testLogin(@Body() loginDto: TestLoginDto): Promise<ApiResponse> {
        const tokens = this.authService.generateTokens({
            sub: loginDto.userId,
            email: loginDto.email,
        });

        return {
            data: tokens,
            status: ResponseStatus.SUCCESS,
            message: 'Token generated successfully',
        };
    }

    /**
     * Protected route example - requires JWT token
     */
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req: Request & { user: any }): ApiResponse {
        return {
            data: req.user,
            status: ResponseStatus.SUCCESS,
            message: 'Profile retrieved successfully',
        };
    }

    /**
     * Public route example - no authentication required
     */
    @Public()
    @Get('public')
    getPublicData(): ApiResponse {
        return {
            data: { message: 'This is public data' },
            status: ResponseStatus.SUCCESS,
        };
    }
}
