import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Database
  DATABASE_URL: Joi.string()
    .required()
    .description('PostgreSQL connection string'),
  DIRECT_URL: Joi.string()
    .optional()
    .description('Direct PostgreSQL connection string for migrations (Neon)'),

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
  // Optional in production since JWT is now used for admin authentication
  ADMIN_SECRET: Joi.string()
    .min(32)
    .optional()
    .description(
      'Admin panel secret key (min 32 characters) - optional in production',
    ),

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
