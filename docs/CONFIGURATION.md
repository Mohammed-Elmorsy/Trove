# Configuration Guide

## Overview

The Trove backend uses NestJS's `ConfigModule` for centralized, type-safe configuration management with validation.

## Architecture

### Configuration Structure

```
backend/src/config/
├── app.config.ts          # Application-level configuration
├── database.config.ts     # Database configuration
└── validation.schema.ts   # Joi validation schema
```

### Features

1. **Type Safety** - Typed configuration interfaces
2. **Validation** - Joi schema validation at startup
3. **Namespaces** - Organized configuration by domain
4. **Environment-specific** - Different configs per environment
5. **Global Access** - Available throughout the application via DI

## Configuration Namespaces

### App Configuration

**File:** `src/config/app.config.ts`

```typescript
interface AppConfig {
  port: number; // Application port
  nodeEnv: string; // Environment: development, production, test
  frontendUrl: string; // Frontend URL for CORS
}
```

**Usage:**

```typescript
constructor(private configService: ConfigService) {
  const appConfig = this.configService.get<AppConfig>('app');
  console.log(appConfig.port); // Type-safe access
}
```

### Database Configuration

**File:** `src/config/database.config.ts`

```typescript
interface DatabaseConfig {
  url: string; // PostgreSQL connection string
}
```

**Usage:**

```typescript
const databaseConfig = this.configService.get<DatabaseConfig>('database');
const dbUrl = databaseConfig.url;
```

## Environment Variables

### File Priority

ConfigModule loads environment variables in this order (first found wins):

1. `.env.local` - Local overrides (not committed)
2. `.env.${NODE_ENV}` - Environment-specific (.env.development, .env.production, .env.test)
3. `.env` - Default fallback

### Required Variables

| Variable       | Type         | Required | Description                                            |
| -------------- | ------------ | -------- | ------------------------------------------------------ |
| `DATABASE_URL` | string (URI) | Yes      | PostgreSQL connection string                           |
| `PORT`         | number       | No       | Server port (default: 4000)                            |
| `NODE_ENV`     | enum         | No       | Environment: development, production, test             |
| `FRONTEND_URL` | string (URI) | No       | Frontend URL for CORS (default: http://localhost:3000) |

### Future Variables (Milestone 6)

| Variable         | Type   | Required | Description                       |
| ---------------- | ------ | -------- | --------------------------------- |
| `JWT_SECRET`     | string | Yes      | JWT signing secret (min 32 chars) |
| `JWT_EXPIRES_IN` | string | No       | JWT expiration (default: 7d)      |

## Validation

### Joi Schema

Configuration is validated at application startup using Joi:

```typescript
validationSchema = Joi.object({
  DATABASE_URL: Joi.string().uri().required(),
  PORT: Joi.number().port().default(4000),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  FRONTEND_URL: Joi.string().uri().default('http://localhost:3000'),
});
```

### Validation Options

- **abortEarly**: `true` - Stops on first validation error
- **allowUnknown**: `true` - Allows extra environment variables for future expansion

### Error Handling

If validation fails, the application will not start and will display:

```
Error: Config validation error: "DATABASE_URL" is required
```

## Environment Setup

### Development

**File:** `.env.development`

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/trove?schema=public"
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Run:**

```bash
NODE_ENV=development npm run start:dev
```

### Production

**File:** `.env.production`

```bash
DATABASE_URL="postgresql://user:password@host:5432/trove?schema=public"
PORT=4000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

**Run:**

```bash
NODE_ENV=production npm run start:prod
```

### Test

**File:** `.env.test`

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/trove_test?schema=public"
PORT=4001
NODE_ENV=test
FRONTEND_URL=http://localhost:3000
```

**Run:**

```bash
NODE_ENV=test npm run test:e2e
```

### Local Overrides

Create `.env.local` for machine-specific overrides (never committed):

```bash
PORT=5000
DATABASE_URL="postgresql://localhost:5432/trove_custom"
```

## Adding New Configuration

### 1. Create Configuration Namespace

**File:** `src/config/feature.config.ts`

```typescript
import { registerAs } from '@nestjs/config';

export interface FeatureConfig {
  apiKey: string;
  timeout: number;
}

export default registerAs(
  'feature',
  (): FeatureConfig => ({
    apiKey: process.env.FEATURE_API_KEY || '',
    timeout: parseInt(process.env.FEATURE_TIMEOUT || '5000', 10),
  })
);
```

### 2. Update Validation Schema

**File:** `src/config/validation.schema.ts`

```typescript
export const validationSchema = Joi.object({
  // ... existing validations
  FEATURE_API_KEY: Joi.string().required(),
  FEATURE_TIMEOUT: Joi.number().default(5000),
});
```

### 3. Register in AppModule

**File:** `src/app.module.ts`

```typescript
import featureConfig from './config/feature.config';

ConfigModule.forRoot({
  load: [databaseConfig, appConfig, featureConfig],
  // ... other options
});
```

### 4. Use in Services

```typescript
import { FeatureConfig } from './config/feature.config';

constructor(private configService: ConfigService) {
  const config = this.configService.get<FeatureConfig>('feature');
  console.log(config.apiKey); // Type-safe!
}
```

## Best Practices

### 1. Always Use Type-Safe Access

✅ **Good:**

```typescript
const appConfig = configService.get<AppConfig>('app');
const port = appConfig.port;
```

❌ **Bad:**

```typescript
const port = process.env.PORT; // No validation, type safety, or defaults
```

### 2. Provide Sensible Defaults

```typescript
port: parseInt(process.env.PORT || '4000', 10),
```

### 3. Validate at Startup

Add all required env vars to the Joi schema to catch configuration errors early.

### 4. Never Commit Secrets

- Keep `.env` files out of version control
- Use `.env.example` as a template
- Use secret management in production (AWS Secrets Manager, etc.)

### 5. Document All Variables

Update this guide when adding new configuration options.

## Troubleshooting

### Configuration Not Loading

**Problem:** Environment variables return `undefined`

**Solutions:**

1. Check file naming: `.env.development` not `.env-development`
2. Verify `NODE_ENV` matches filename
3. Ensure ConfigModule is imported in module
4. Check validation schema doesn't reject values

### Validation Errors

**Problem:** App crashes with validation error

**Solutions:**

1. Check all required variables are set
2. Verify variable types (string, number, URI)
3. Check enum values match (development, production, test)
4. Review validation.schema.ts requirements

### Wrong Environment Loaded

**Problem:** Using development config in production

**Solutions:**

1. Set `NODE_ENV=production` before starting
2. Check environment variable precedence
3. Verify `.env.production` exists
4. Remove conflicting `.env.local` overrides

## Testing Configuration

### Unit Tests

Mock ConfigService in tests:

```typescript
const mockConfigService = {
  get: jest.fn((key: string) => {
    const config = {
      app: { port: 4000, nodeEnv: 'test', frontendUrl: 'http://localhost:3000' },
      database: { url: 'postgresql://test:test@localhost:5432/test' },
    };
    return config[key];
  }),
};

providers: [{ provide: ConfigService, useValue: mockConfigService }];
```

### E2E Tests

Use `.env.test` with separate test database:

```bash
NODE_ENV=test npm run test:e2e
```

## Security Considerations

1. **Never log sensitive config values** (passwords, secrets)
2. **Use environment-specific secrets** in production
3. **Rotate secrets regularly**
4. **Use secret management services** (AWS Secrets Manager, HashiCorp Vault)
5. **Audit configuration access** in production

## References

- [NestJS Configuration Documentation](https://docs.nestjs.com/techniques/configuration)
- [Joi Validation API](https://joi.dev/api/)
- [Environment Variables Best Practices](https://12factor.net/config)
