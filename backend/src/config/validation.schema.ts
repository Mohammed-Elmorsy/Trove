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

  // JWT (Will be used in Milestone 6)
  // JWT_SECRET: Joi.string().min(32).description('JWT secret key'),
  // JWT_EXPIRES_IN: Joi.string().default('7d').description('JWT expiration time'),
});
