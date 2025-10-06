# Deployment Checklist - GTI Pricing Engine

## Pre-Deployment Requirements

### 1. Environment Configuration
- [ ] All required environment variables set in Vercel dashboard
- [ ] Supabase connection tested
- [ ] Redis/Upstash cache configured (if using)
- [ ] GitHub integration configured (if using)

### 2. Build Validation
- [ ] Run `pnpm install` successfully
- [ ] Run `pnpm build` locally without errors
- [ ] Run `pnpm lint` and fix all errors
- [ ] TypeScript compilation passes (`tsc --noEmit`)

### 3. Database Setup
- [ ] All SQL migration scripts executed in order
- [ ] Database schema matches application expectations
- [ ] Row-Level Security (RLS) policies enabled
- [ ] Test data seeded (for staging/preview)

### 4. Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Pricing engine calculations validated
- [ ] Best deal logic tested
- [ ] BOGO promotions tested
- [ ] Volume/tiered pricing tested

### 5. Security
- [ ] Authentication working correctly
- [ ] RLS policies tested
- [ ] API routes protected
- [ ] Environment variables secured
- [ ] No sensitive data in client-side code

### 6. Performance
- [ ] Pricing calculations < 200ms
- [ ] API responses < 500ms
- [ ] Database queries optimized
- [ ] Caching configured

### 7. Monitoring
- [ ] Error tracking configured
- [ ] Logging endpoints set up
- [ ] Performance monitoring enabled
- [ ] Alerts configured

## Deployment Steps

### Production Deployment
1. Merge to `main` branch
2. Vercel auto-deploys
3. Run smoke tests
4. Monitor error logs
5. Validate critical workflows

### Rollback Plan
1. Revert to previous deployment in Vercel dashboard
2. Check database migrations (may need manual rollback)
3. Notify team of rollback
4. Investigate and fix issues
5. Re-deploy when ready

## Post-Deployment Validation

### Critical Workflows to Test
- [ ] User login/authentication
- [ ] Create customer discount
- [ ] Create inventory discount
- [ ] Create BOGO promotion
- [ ] Calculate pricing for test order
- [ ] View analytics dashboard
- [ ] Generate rebate report

### Performance Checks
- [ ] Page load times acceptable
- [ ] API response times within SLA
- [ ] Database query performance good
- [ ] No memory leaks

### Monitoring
- [ ] Check error logs (first 24 hours)
- [ ] Monitor API response times
- [ ] Watch database connection pool
- [ ] Track user activity

## Known Issues

### Current Blockers
1. **tiny-invariant Parse Error** - ESM CDN issue
   - **Status**: Investigating
   - **Workaround**: Remove tiny-invariant from package.json
   - **Fix**: TBD

2. **Preview Not Working** - Tailwind CSS v4 syntax
   - **Status**: Needs conversion to v3
   - **Impact**: Cannot test in preview
   - **Priority**: HIGH

### Non-Blocking Issues
1. Customer group management UI could be enhanced
2. Bundle deal limit (4-5 max) not enforced
3. Automated background jobs need cron configuration

## Support Contacts

- **Technical Lead**: [Name]
- **DevOps**: [Name]
- **Database Admin**: [Name]
- **Business Owner**: [Name]

## Deployment History

| Date | Version | Deployed By | Notes |
|------|---------|-------------|-------|
| TBD  | 1.0.0   | TBD         | Initial production deployment |

---

**Last Updated**: 2025-01-06
**Next Review**: After first production deployment
