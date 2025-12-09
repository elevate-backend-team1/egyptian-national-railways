export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'egyptian-railways-jwt-secret-key-2024',
  accessTokenExpiration: parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRATION || '2592000', 10),
  refreshTokenExpiration: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION || '604800', 10)
};
