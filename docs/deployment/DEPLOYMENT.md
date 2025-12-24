# Deployment Guide

This guide covers deploying the Trove e-commerce application to production using:

- **Backend**: Railway (NestJS)
- **Database**: Neon (PostgreSQL)
- **Frontend**: Vercel (Next.js)
- **Mobile**: EAS Build (Expo)

## Prerequisites

- GitHub account with repository access
- Railway account (https://railway.app)
- Neon account (https://neon.tech)
- Vercel account (https://vercel.com)
- Expo account (https://expo.dev)

## 1. Database Setup (Neon)

### Create Database

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection strings:
   - **Pooled connection** (for app): `postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require`
   - **Direct connection** (for migrations): `postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`

### Initial Migration

Run migrations against the production database:

```bash
cd backend
# Set environment variables (Prisma 7 reads from prisma.config.ts)
DATABASE_URL="your-neon-pooled-connection-string" \
DIRECT_URL="your-neon-direct-connection-string" \
npx prisma migrate deploy
```

> **Note (Prisma 7)**: Database URL configuration is in `backend/prisma.config.ts`.
> The `DIRECT_URL` is used for migrations (bypasses connection pooling) and
> `DATABASE_URL` is used by the application at runtime via the `@prisma/adapter-pg` adapter.

### Seed Data (Optional)

```bash
DATABASE_URL="your-neon-connection-string" npx prisma db seed
```

## 2. Backend Deployment (Railway)

### Create Railway Project

1. Sign up at [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select the Trove repository
4. Set the root directory to `backend`

### Configure Environment Variables

Add these environment variables in Railway dashboard:

| Variable                 | Value                                   |
| ------------------------ | --------------------------------------- |
| `DATABASE_URL`           | Neon pooled connection string           |
| `DIRECT_URL`             | Neon direct connection string           |
| `PORT`                   | `4000`                                  |
| `NODE_ENV`               | `production`                            |
| `JWT_SECRET`             | Generate with `openssl rand -base64 32` |
| `JWT_REFRESH_SECRET`     | Generate with `openssl rand -base64 32` |
| `JWT_ACCESS_EXPIRATION`  | `15m`                                   |
| `JWT_REFRESH_EXPIRATION` | `7d`                                    |
| `ALLOWED_ORIGINS`        | `https://your-app.vercel.app`           |
| `FRONTEND_URL`           | `https://your-app.vercel.app`           |

### Get Railway Token for CI/CD

1. Go to Railway dashboard → Account Settings → Tokens
2. Create a new token
3. Add it as `RAILWAY_TOKEN` in GitHub repository secrets

### Verify Deployment

After deployment, Railway provides a URL like `https://your-backend.railway.app`. Test it:

```bash
curl https://your-backend.railway.app/products
```

## 3. Frontend Deployment (Vercel)

### Connect Repository

1. Sign up at [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import the Trove repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`

### Configure Environment Variables

Add in Vercel project settings:

| Variable               | Value                              |
| ---------------------- | ---------------------------------- |
| `NEXT_PUBLIC_API_URL`  | `https://your-backend.railway.app` |
| `NEXT_PUBLIC_SITE_URL` | `https://your-app.vercel.app`      |

### Verify Deployment

After deployment, visit your Vercel URL to confirm the frontend is working and connecting to the backend.

## 4. Mobile Deployment (EAS Build)

### Initial Setup

```bash
cd mobile

# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo
eas login

# Initialize EAS project (creates project ID)
eas build:configure
```

### Update Configuration

After running `eas build:configure`, update `mobile/app.config.ts`:

1. Set `owner` to your Expo username
2. Set `extra.eas.projectId` to the generated project ID

### Update eas.json

Edit `mobile/eas.json` and replace `https://your-backend.railway.app` with your actual Railway URL.

### Create Preview Build

```bash
# Android APK (no Play Store account needed)
eas build --profile preview --platform android

# iOS (requires Apple Developer account)
eas build --profile preview --platform ios
```

### Get Expo Token for CI/CD

1. Go to [expo.dev](https://expo.dev) → Account Settings → Access Tokens
2. Create a new token
3. Add it as `EXPO_TOKEN` in GitHub repository secrets

## 5. GitHub Secrets Setup

Add these secrets in your GitHub repository (Settings → Secrets and variables → Actions):

| Secret          | Description                      |
| --------------- | -------------------------------- |
| `RAILWAY_TOKEN` | Railway API token for deployment |
| `EXPO_TOKEN`    | Expo access token for EAS builds |

## 6. CI/CD Workflows

### Automatic CI

On every push/PR to `main` or `develop`:

- Runs formatting check
- Runs ESLint on all apps
- Runs backend tests
- Builds all apps

### Backend Auto-Deploy

On push to `main` with changes in `backend/`:

- Automatically deploys to Railway

### Frontend Auto-Deploy

Vercel automatically deploys on every push to `main`.

### Mobile Manual Build

Trigger manually from GitHub Actions:

1. Go to Actions → "Mobile EAS Preview Build"
2. Click "Run workflow"
3. Select platform (android/ios/all)

## Rollback Procedures

### Backend (Railway)

```bash
# List deployments
railway deployments

# Rollback to previous deployment
railway rollback
```

Or use the Railway dashboard to select a previous deployment.

### Frontend (Vercel)

1. Go to Vercel dashboard → Deployments
2. Find the previous working deployment
3. Click "..." → "Promote to Production"

### Database (Neon)

Neon supports point-in-time recovery:

1. Go to Neon dashboard → Branches
2. Create a new branch from a specific point in time
3. Update DATABASE_URL to point to the restored branch

## Monitoring

### Railway

- View logs in Railway dashboard
- Set up alerts for deployment failures

### Vercel

- View function logs in Vercel dashboard
- Analytics available for performance monitoring

### Neon

- Query insights available in dashboard
- Connection pooling metrics

## Troubleshooting

### Backend won't start

1. Check Railway logs for errors
2. Verify all environment variables are set
3. Ensure DATABASE_URL is correct
4. Check if migrations ran successfully

### Frontend can't connect to backend

1. Verify `NEXT_PUBLIC_API_URL` is correct
2. Check CORS settings (`ALLOWED_ORIGINS` on backend)
3. Ensure backend is running and accessible

### Mobile build fails

1. Check Expo build logs
2. Verify `owner` and `projectId` in app.config.ts
3. Ensure all native dependencies are compatible

### Database connection issues

1. Verify connection strings are correct
2. Check if IP allowlist is configured (Neon allows all by default)
3. Ensure SSL mode is enabled (`?sslmode=require`)

## Cost Estimates (Free Tiers)

| Service | Free Tier                           |
| ------- | ----------------------------------- |
| Railway | $5 credit/month, ~500 hours         |
| Neon    | 0.5 GB storage, 190 compute hours   |
| Vercel  | 100 GB bandwidth, unlimited deploys |
| EAS     | 30 builds/month                     |

All services offer generous free tiers suitable for development and small-scale production use.
