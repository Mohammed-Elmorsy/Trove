import { registerAs } from '@nestjs/config';

export interface AppConfig {
  port: number;
  nodeEnv: string;
  frontendUrl: string;
  allowedOrigins: string[];
  adminSecret: string;
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
  }),
);
