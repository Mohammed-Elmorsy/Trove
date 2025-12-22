import { registerAs } from '@nestjs/config';

export interface JwtConfig {
  secret: string;
  refreshSecret: string;
  accessExpiration: string;
  refreshExpiration: string;
}

export interface AppConfig {
  port: number;
  nodeEnv: string;
  frontendUrl: string;
  allowedOrigins: string[];
  adminSecret: string;
  jwt: JwtConfig;
}

export default registerAs(
  'app',
  (): AppConfig => ({
    port: parseInt(process.env.PORT || '4000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    allowedOrigins: (
      process.env.ALLOWED_ORIGINS ||
      'http://localhost:3000,http://localhost:8081,http://localhost:19006'
    ).split(','),
    adminSecret: process.env.ADMIN_SECRET || '',
    jwt: {
      secret: process.env.JWT_SECRET || '',
      refreshSecret: process.env.JWT_REFRESH_SECRET || '',
      accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
      refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
    },
  }),
);
