import * as Joi from 'joi';

/**
 * Custom validator for JWT secrets to ensure sufficient entropy
 * Checks for weak patterns and minimum unique characters
 */
const strongSecretValidator: Joi.CustomValidator<string> = (value, helpers) => {
  // Check for common weak patterns
  const weakPatterns = [
    /^(.)\1+$/, // All same character (e.g., "aaaaaaaaaaaaaaaa")
    /^(01234567890)+/, // Sequential numbers
    /^(abcdefghijklmnop)+/i, // Sequential letters
    /^your-.*-secret/i, // Default placeholder pattern
    /^change-?me/i, // Common placeholder
    /^secret/i, // Starts with "secret"
  ];

  for (const pattern of weakPatterns) {
    if (pattern.test(value)) {
      return helpers.error('string.pattern.base', {
        message:
          'JWT secret appears to be weak. Use a cryptographically random string.',
      });
    }
  }

  // Check entropy - require at least 16 unique characters
  const uniqueChars = new Set(value.split('')).size;
  if (uniqueChars < 16) {
    return helpers.error('string.pattern.base', {
      message: `JWT secret lacks sufficient entropy (${uniqueChars} unique chars, need 16+). Use a cryptographically random string.`,
    });
  }

  return value;
};

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

  // JWT Authentication
  JWT_SECRET: Joi.string()
    .min(32)
    .required()
    .custom(strongSecretValidator, 'JWT secret strength validation')
    .description('JWT secret key for access tokens'),
  JWT_REFRESH_SECRET: Joi.string()
    .min(32)
    .required()
    .custom(strongSecretValidator, 'JWT refresh secret strength validation')
    .description('JWT secret key for refresh tokens'),
  JWT_ACCESS_EXPIRATION: Joi.string()
    .default('15m')
    .description('Access token expiration'),
  JWT_REFRESH_EXPIRATION: Joi.string()
    .default('7d')
    .description('Refresh token expiration'),
});
