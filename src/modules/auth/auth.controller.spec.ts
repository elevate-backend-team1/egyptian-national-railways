import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ResponseStatus } from '../../common/interfaces/response.interface';

describe('AuthController', () => {
    let controller: AuthController;
    let authService: AuthService;

    const mockAuthService = {
        generateTokens: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('testLogin', () => {
        it('should generate tokens and return success response', async () => {
            const loginDto = {
                email: 'test@example.com',
                userId: '123456',
            };

            const mockTokens = {
                accessToken: 'access-token-123',
                refreshToken: 'refresh-token-123',
            };

            mockAuthService.generateTokens.mockReturnValue(mockTokens);

            const result = await controller.testLogin(loginDto);

            expect(result).toEqual({
                data: mockTokens,
                status: ResponseStatus.SUCCESS,
                message: 'Token generated successfully',
            });

            expect(mockAuthService.generateTokens).toHaveBeenCalledWith({
                sub: loginDto.userId,
                email: loginDto.email,
            });
        });
    });

    describe('getProfile', () => {
        it('should return user profile from request', () => {
            const mockUser = {
                userId: '123456',
                email: 'test@example.com',
            };

            const mockRequest = {
                user: mockUser,
            } as any;

            const result = controller.getProfile(mockRequest);

            expect(result).toEqual({
                data: mockUser,
                status: ResponseStatus.SUCCESS,
                message: 'Profile retrieved successfully',
            });
        });
    });

    describe('getPublicData', () => {
        it('should return public data without authentication', () => {
            const result = controller.getPublicData();

            expect(result).toEqual({
                data: { message: 'This is public data' },
                status: ResponseStatus.SUCCESS,
            });
        });
    });
});
