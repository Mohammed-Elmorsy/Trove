# Configuration Module

This directory contains type-safe configuration namespaces for the Trove backend application.

## Files

- **`app.config.ts`** - Application-level configuration (port, environment, CORS)
- **`database.config.ts`** - Database connection configuration
- **`validation.schema.ts`** - Joi validation schema for environment variables

## Usage

### Accessing Configuration

Inject `ConfigService` and access namespaced configurations:

```typescript
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config/app.config';

constructor(private configService: ConfigService) {
  // Type-safe access to app configuration
  const appConfig = this.configService.get<AppConfig>('app');
  console.log(appConfig.port);
  console.log(appConfig.nodeEnv);
  console.log(appConfig.frontendUrl);

  // Type-safe access to database configuration
  const dbConfig = this.configService.get<DatabaseConfig>('database');
  console.log(dbConfig.url);
}
```

### Adding New Configuration

1. Create a new config file (e.g., `feature.config.ts`)
2. Define the interface and use `registerAs()`
3. Add validation rules to `validation.schema.ts`
4. Register in `app.module.ts` in the `load` array

## Documentation

For complete configuration documentation, see:

- [docs/CONFIGURATION.md](../../../docs/CONFIGURATION.md)
- [docs/ARCHITECTURE.md](../../../docs/ARCHITECTURE.md)

## Best Practices

✅ Always use typed configuration access
✅ Add validation for all new environment variables
✅ Provide sensible defaults where possible
✅ Document new configuration options
❌ Never access `process.env` directly in services
