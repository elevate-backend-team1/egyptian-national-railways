export const jwtConfig = {
    secret: 'egyptian-railways-jwt-secret-key-2024', // TODO: Move to environment variables in production
    accessTokenExpiration: 2592000, // 30 days in seconds
    refreshTokenExpiration: 604800, // 7 days in seconds
};
