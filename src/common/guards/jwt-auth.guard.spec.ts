import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

describe('JwtAuthGuard', () => {
    let guard: JwtAuthGuard;
    let reflector: Reflector;

    const mockReflector = {
        getAllAndOverride: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JwtAuthGuard,
                {
                    provide: Reflector,
                    useValue: mockReflector,
                },
            ],
        }).compile();

        guard = module.get<JwtAuthGuard>(JwtAuthGuard);
        reflector = module.get<Reflector>(Reflector);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(guard).toBeDefined();
    });

    describe('canActivate', () => {
        it('should return true for public routes', () => {
            const mockContext = {
                getHandler: jest.fn(),
                getClass: jest.fn(),
                switchToHttp: jest.fn().mockReturnValue({
                    getRequest: jest.fn().mockReturnValue({}),
                }),
            } as unknown as ExecutionContext;

            mockReflector.getAllAndOverride.mockReturnValue(true);

            const result = guard.canActivate(mockContext);

            expect(result).toBe(true);
            expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(
                IS_PUBLIC_KEY,
                [mockContext.getHandler(), mockContext.getClass()],
            );
        });
    });

    describe('handleRequest', () => {
        it('should return user for valid authentication', () => {
            const user = { userId: '123', email: 'test@example.com' };

            const result = guard.handleRequest(null, user, null);

            expect(result).toEqual(user);
        });

        it('should throw UnauthorizedException if user is not provided', () => {
            expect(() => guard.handleRequest(null, null, null)).toThrow(
                UnauthorizedException,
            );
            expect(() => guard.handleRequest(null, null, null)).toThrow(
                'Invalid or missing token',
            );
        });

        it('should throw error if error is provided', () => {
            const error = new Error('Token expired');

            expect(() => guard.handleRequest(error, null, null)).toThrow(error);
        });

        it('should throw UnauthorizedException if both error and user are null', () => {
            expect(() => guard.handleRequest(null, null, null)).toThrow(
                UnauthorizedException,
            );
        });
    });
});
