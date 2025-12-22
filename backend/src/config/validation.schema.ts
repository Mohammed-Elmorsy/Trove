import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Database
  DATABASE_URL: Joi.string()
    .uri()
    .required()
    .description('PostgreSQL connection string'),

  // Server
  PORT: Joi.number().port().default(4000).description('Application port'),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development')
    .description('Application environment'),
  FRONTEND_URL: Joi.string()
    .uri()
    .default('http://localhost:3000')
    .description('Frontend application URL for CORS'),

  // Admin (Simple auth for Milestone 5, replaced by JWT in Milestone 6)
  ADMIN_SECRET: Joi.string()
    .min(32)
    .required()
    .description('Admin panel secret key (min 32 characters)'),

  // JWT (Milestone 6)
  JWT_SECRET: Joi.string()
    .min(32)
    .required()
    .description('JWT secret key for access tokens'),
  JWT_REFRESH_SECRET: Joi.string()
    .min(32)
    .required()
    .description('JWT secret key for refresh tokens'),
  JWT_ACCESS_EXPIRATION: Joi.string()
    .default('15m')
    .description('Access token expiration'),
  JWT_REFRESH_EXPIRATION: Joi.string()
    .default('7d')
    .description('Refresh token expiration'),
});
