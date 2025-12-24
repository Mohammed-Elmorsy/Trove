import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'npx ts-node prisma/seed.ts',
  },
  datasource: {
    // Use DIRECT_URL for migrations if available (bypasses connection pooling),
    // otherwise fall back to DATABASE_URL
    url: env('DIRECT_URL') ?? env('DATABASE_URL'),
  },
});
