import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { jwtConfig } from '../../config/jwt.config';

describe('AuthService', () => {
    let service: AuthService;
    let jwtService: JwtService;

    const mockJwtService = {
        sign: jest.fn(),
        verifyAsync: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('generateAccessToken', () => {
        it('should generate an access token', () => {
            const payload = { sub: '123', email: 'test@example.com' };
            const expectedToken = 'access-token-123';

            mockJwtService.sign.mockReturnValue(expectedToken);

            const result = service.generateAccessToken(payload);

            expect(result).toBe(expectedToken);
            expect(mockJwtService.sign).toHaveBeenCalledWith(payload, {
                expiresIn: jwtConfig.accessTokenExpiration,
            });
        });
    });

    describe('generateRefreshToken', () => {
        it('should generate a refresh token', () => {
            const payload = { sub: '123', email: 'test@example.com' };
            const expectedToken = 'refresh-token-123';

            mockJwtService.sign.mockReturnValue(expectedToken);

            const result = service.generateRefreshToken(payload);

            expect(result).toBe(expectedToken);
            expect(mockJwtService.sign).toHaveBeenCalledWith(payload, {
                expiresIn: jwtConfig.refreshTokenExpiration,
            });
        });
    });

    describe('generateTokens', () => {
        it('should generate both access and refresh tokens', () => {
            const payload = { sub: '123', email: 'test@example.com' };
            const accessToken = 'access-token-123';
            const refreshToken = 'refresh-token-123';

            mockJwtService.sign
                .mockReturnValueOnce(accessToken)
                .mockReturnValueOnce(refreshToken);

            const result = service.generateTokens(payload);

            expect(result).toEqual({
                accessToken,
                refreshToken,
            });
            expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
        });
    });

    describe('verifyToken', () => {
        it('should verify and decode a valid token', async () => {
            const token = 'valid-token';
            const decodedPayload = { sub: '123', email: 'test@example.com' };

            mockJwtService.verifyAsync.mockResolvedValue(decodedPayload);

            const result = await service.verifyToken(token);

            expect(result).toEqual(decodedPayload);
            expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(token);
        });

        it('should throw an error for invalid token', async () => {
            const token = 'invalid-token';

            mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

            await expect(service.verifyToken(token)).rejects.toThrow(
                'Invalid or expired token',
            );
        });
    });
});
