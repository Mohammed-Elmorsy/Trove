# Milestone 7: CI/CD & Deployment

**Status**: Complete
**Date**: December 2025

## Overview

This milestone implements a complete CI/CD pipeline and deployment infrastructure for the Trove e-commerce application, enabling automated testing, building, and deployment across all platforms.

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        GitHub Repository                         │
├─────────────────────────────────────────────────────────────────┤
│  Push/PR to main/develop                                        │
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────────┐                                            │
│  │  GitHub Actions │                                            │
│  │       CI        │                                            │
│  └────────┬────────┘                                            │
│           │                                                      │
│           ├──────────────┬──────────────┬──────────────┐        │
│           ▼              ▼              ▼              ▼        │
│     ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐   │
│     │ Format  │    │ Backend │    │Frontend │    │ Mobile  │   │
│     │  Check  │    │  CI     │    │   CI    │    │   CI    │   │
│     └─────────┘    └─────────┘    └─────────┘    └─────────┘   │
│                          │              │                       │
│                          ▼              ▼                       │
│                    ┌─────────┐    ┌─────────┐                   │
│                    │ Railway │    │ Vercel  │                   │
│                    │  Auto   │    │  Auto   │                   │
│                    │ Deploy  │    │ Deploy  │                   │
│                    └────┬────┘    └────┬────┘                   │
│                         │              │                        │
└─────────────────────────┼──────────────┼────────────────────────┘
                          │              │
                          ▼              ▼
┌─────────────────┐  ┌─────────────┐  ┌─────────────┐
│      Neon       │  │   Railway   │  │   Vercel    │
│   PostgreSQL    │◄─┤   Backend   │  │  Frontend   │
│    Database     │  │   (NestJS)  │  │  (Next.js)  │
└─────────────────┘  └─────────────┘  └─────────────┘
```

## Features Implemented

### 1. Backend Docker Configuration

- **Dockerfile**: Multi-stage build for optimized production image
  - Build stage: Compiles TypeScript and generates Prisma client
  - Production stage: Minimal runtime with security hardening
  - Uses `dumb-init` for proper signal handling
  - Runs as non-root user for security

- **railway.json**: Railway deployment configuration
  - Dockerfile-based builds
  - Automatic database migrations on deploy
  - Health checks and restart policies

### 2. Database Configuration (Neon)

- Updated Prisma schema with `directUrl` for Neon compatibility
- Supports connection pooling for serverless environments
- Made `ADMIN_SECRET` optional (JWT is now primary auth)

### 3. Mobile EAS Configuration

- **eas.json**: Build profiles for development, preview, and production
  - Development: For local development client
  - Preview: Internal distribution APKs/IPAs
  - Production: Store-ready builds

- **app.config.ts**: Updated with EAS requirements
  - Bundle identifiers for iOS and Android
  - EAS project ID configuration
  - Owner field for managed builds

### 4. GitHub Actions Workflows

#### CI Workflow (ci.yml)

Runs on every push/PR to main and develop:

| Job          | Description                             |
| ------------ | --------------------------------------- |
| Format Check | Validates code formatting with Prettier |
| Backend CI   | Lint → Test → Build                     |
| Frontend CI  | Lint → Build                            |
| Mobile CI    | TypeScript check → Lint                 |

#### Backend Deploy (deploy-backend.yml)

- Triggered on push to main with backend changes
- Uses Railway CLI for deployment
- Requires `RAILWAY_TOKEN` secret

#### Mobile Preview (mobile-preview.yml)

- Manual trigger via workflow_dispatch
- Platform selection (android/ios/all)
- Uses EAS CLI for builds
- Requires `EXPO_TOKEN` secret

### 5. Documentation

- **DEPLOYMENT.md**: Comprehensive deployment guide
  - Step-by-step setup instructions
  - Environment variable reference
  - Troubleshooting guide
  - Rollback procedures

## Files Created

| File                                   | Purpose                          |
| -------------------------------------- | -------------------------------- |
| `backend/Dockerfile`                   | Docker build configuration       |
| `backend/.dockerignore`                | Files excluded from Docker build |
| `backend/railway.json`                 | Railway deployment settings      |
| `mobile/eas.json`                      | EAS Build profiles               |
| `.github/workflows/ci.yml`             | CI pipeline                      |
| `.github/workflows/deploy-backend.yml` | Backend CD                       |
| `.github/workflows/mobile-preview.yml` | Mobile builds                    |
| `docs/deployment/DEPLOYMENT.md`        | Deployment documentation         |

## Files Modified

| File                                      | Changes                                          |
| ----------------------------------------- | ------------------------------------------------ |
| `backend/prisma/schema.prisma`            | Added `directUrl` for Neon                       |
| `backend/src/config/validation.schema.ts` | Made `ADMIN_SECRET` optional, added `DIRECT_URL` |
| `mobile/app.config.ts`                    | Added EAS configuration fields                   |
| `README.md`                               | Added CI/CD badges and deployment section        |

## Environment Variables

### Backend (Railway)

```
DATABASE_URL=postgresql://...@ep-xxx-pooler.neon.tech/db?sslmode=require
DIRECT_URL=postgresql://...@ep-xxx.neon.tech/db?sslmode=require
PORT=4000
NODE_ENV=production
JWT_SECRET=<32+ characters>
JWT_REFRESH_SECRET=<32+ characters>
ALLOWED_ORIGINS=https://your-app.vercel.app
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend (Vercel)

```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

### GitHub Secrets

```
RAILWAY_TOKEN=<from Railway dashboard>
EXPO_TOKEN=<from expo.dev>
```

## Manual Setup Required

After the code changes, the user needs to:

1. **Create Neon database** and get connection strings
2. **Create Railway project** and link to GitHub
3. **Connect Vercel** to the repository
4. **Run `eas init`** in mobile folder
5. **Add GitHub secrets** (RAILWAY_TOKEN, EXPO_TOKEN)
6. **Update placeholder values** in eas.json and app.config.ts

## CI/CD Flow

```
Developer pushes code
        │
        ▼
┌───────────────────┐
│   GitHub Actions  │
│   runs CI checks  │
└────────┬──────────┘
         │
    All checks pass?
         │
    Yes  │  No
         │   └──► PR blocked
         ▼
┌───────────────────┐
│  Merge to main    │
└────────┬──────────┘
         │
         ├─────────────────────┐
         ▼                     ▼
┌─────────────────┐    ┌─────────────────┐
│ Backend changes?│    │ Vercel auto-    │
│ Deploy to       │    │ deploys frontend│
│ Railway         │    │                 │
└─────────────────┘    └─────────────────┘
```

## Testing the Setup

### Verify CI

1. Create a PR with any code change
2. Check that all CI jobs pass
3. Merge to main

### Verify Backend Deployment

```bash
# After Railway deployment
curl https://your-backend.railway.app/products
```

### Verify Frontend Deployment

Visit your Vercel URL and confirm the app loads and connects to the backend.

### Verify Mobile Build

1. Go to GitHub Actions
2. Run "Mobile EAS Preview Build" workflow
3. Download the APK/IPA from EAS dashboard

## Security Considerations

1. **Secrets Management**: All sensitive values stored in platform secrets, not in code
2. **Non-root Container**: Backend Docker runs as non-root user
3. **SSL Required**: Database connections require SSL
4. **Token Rotation**: Railway and Expo tokens can be rotated without code changes

## Cost Summary (Free Tiers)

| Service | Free Tier        |
| ------- | ---------------- |
| Railway | $5 credit/month  |
| Neon    | 0.5 GB storage   |
| Vercel  | 100 GB bandwidth |
| EAS     | 30 builds/month  |

## Next Steps (Post-Milestone 7)

- Set up monitoring and alerting
- Configure custom domains
- Implement staging environment
- Add E2E tests to CI pipeline
- Set up database backups
