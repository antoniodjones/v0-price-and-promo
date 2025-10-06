# Deployment Guide

## Pre-Deployment Checklist

Before deploying to Vercel, ensure:

### 1. Environment Variables
All required environment variables are set in Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `POSTGRES_URL` (auto-configured by Supabase)
- See `.env.example` for complete list

### 2. Run Validation Scripts
\`\`\`bash
# Type check
pnpm run type-check

# Lint check
pnpm run lint

# Full validation
pnpm run validate

# Test production build locally
pnpm run build:production
\`\`\`

### 3. Database Migrations
Ensure all SQL scripts in `/scripts` have been executed:
\`\`\`bash
# Check latest migration
ls -lt scripts/*.sql | head -5
\`\`\`

### 4. Vercel Configuration
- `vercel.json` is configured with proper regions and function timeouts
- Build command: `pnpm build`
- Install command: `pnpm install --no-frozen-lockfile`

## Deployment Process

### Option 1: GitHub Integration (Recommended)
1. Push to `main` branch
2. Vercel automatically deploys
3. Monitor build logs in Vercel dashboard

### Option 2: Vercel CLI
\`\`\`bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
\`\`\`

## Post-Deployment Validation

After deployment, verify:

1. **Health Check**: Visit `/api/health` endpoint
2. **Database Connection**: Check dashboard loads data
3. **Authentication**: Test login flow
4. **API Endpoints**: Verify critical API routes work

## Troubleshooting

### Build Failures

**TypeScript Errors**
\`\`\`bash
# Run type check locally
pnpm run type-check

# Fix errors before deploying
\`\`\`

**ESLint Errors**
\`\`\`bash
# Run lint locally
pnpm run lint

# Auto-fix where possible
pnpm run lint --fix
\`\`\`

**Environment Variables Missing**
- Check Vercel project settings → Environment Variables
- Ensure all required vars from `.env.example` are set
- Redeploy after adding variables

### Runtime Errors

**Database Connection Issues**
- Verify Supabase integration is active
- Check `POSTGRES_URL` is set correctly
- Ensure database migrations are applied

**API Timeout Errors**
- Check `vercel.json` function timeout settings
- Default is 30s, increase if needed for long operations

## Rollback Procedure

If deployment fails:

1. Go to Vercel dashboard → Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"
4. Fix issues locally before redeploying

## Monitoring

- **Vercel Analytics**: Monitor performance and errors
- **Supabase Dashboard**: Check database health
- **Error Logs**: Review in Vercel deployment logs
