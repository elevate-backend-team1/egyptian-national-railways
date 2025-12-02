import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { jwtConfig } from '../../../config/jwt.config';

describe('JwtStrategy', () => {
    let strategy: JwtStrategy;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [JwtStrategy],
        }).compile();

        strategy = module.get<JwtStrategy>(JwtStrategy);
    });

    it('should be defined', () => {
        expect(strategy).toBeDefined();
    });

    describe('validate', () => {
        it('should return user data for valid payload', async () => {
            const payload = {
                sub: '123456',
                email: 'test@example.com',
                iat: 1234567890,
                exp: 1234571490,
            };

            const result = await strategy.validate(payload);

            expect(result).toEqual({
                userId: '123456',
                email: 'test@example.com',
            });
        });

        it('should throw UnauthorizedException if sub is missing', async () => {
            const payload = {
                sub: '',
                email: 'test@example.com',
                iat: 1234567890,
                exp: 1234571490,
            };

            await expect(strategy.validate(payload)).rejects.toThrow(
                UnauthorizedException,
            );
            await expect(strategy.validate(payload)).rejects.toThrow(
                'Invalid token payload',
            );
        });

        it('should throw UnauthorizedException if email is missing', async () => {
            const payload = {
                sub: '123456',
                email: '',
                iat: 1234567890,
                exp: 1234571490,
            };

            await expect(strategy.validate(payload)).rejects.toThrow(
                UnauthorizedException,
            );
            await expect(strategy.validate(payload)).rejects.toThrow(
                'Invalid token payload',
            );
        });

        it('should throw UnauthorizedException if both sub and email are missing', async () => {
            const payload = {
                sub: '',
                email: '',
                iat: 1234567890,
                exp: 1234571490,
            };

            await expect(strategy.validate(payload)).rejects.toThrow(
                UnauthorizedException,
            );
        });
    });
});
