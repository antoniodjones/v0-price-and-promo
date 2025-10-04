# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

GTI Pricing & Promotions Engine - A sophisticated enterprise cannabis retail pricing and promotion management system built with Next.js 14, TypeScript, Prisma, and PostgreSQL. This is a comprehensive B2B pricing solution that automates complex wholesale pricing decisions while maintaining integration across the complete order-to-cash workflow.

### Key Business Domain
- **Cannabis wholesale pricing automation**
- **Customer tier-based discounting (A/B/C tiers)**
- **Inventory-based automated pricing (expiration dates, THC levels)**
- **BOGO promotions and bundle deals**
- **Multi-market pricing strategies**
- **Real-time pricing engine with audit trails**

## Development Commands

### Core Development
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

### Database Operations
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Reset database (development only)
npx prisma migrate reset

# Access database studio
npx prisma studio

# Deploy migrations to production
npx prisma migrate deploy
```

### Testing
```bash
# Run single test file
pnpm test <test-file-name>

# Run tests in watch mode
pnpm test:watch

# Run all tests
pnpm test:all
```

## Architecture & Code Organization

### Clean Architecture Implementation
The codebase follows Clean Architecture principles with clear separation of concerns:

```
├── app/                    # Next.js App Router (UI Layer)
│   ├── api/               # API endpoints (Controllers)
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx          # Dashboard page
├── components/            # UI Components (Atomic Design)
│   ├── ui/               # Base UI components (atoms)
│   └── [feature]/        # Feature-specific components
├── lib/                  # Business Logic & Infrastructure
│   ├── pricing-engine.ts # Core pricing calculation engine
│   ├── types.ts         # Domain types and interfaces
│   ├── database.ts      # Database connection utilities
│   └── utils.ts         # Shared utilities
├── prisma/              # Database Schema & Migrations
│   └── schema.prisma    # Complete database schema
└── hooks/               # Custom React hooks
```

### Key Business Logic Components

#### Pricing Engine (`lib/pricing-engine.ts`)
- **Core pricing calculation logic**
- Volume pricing tiers
- Customer tier-based pricing
- Discount calculation algorithms
- Pricing audit logging

#### Database Schema (`prisma/schema.prisma`)
- **Customer**: A/B/C tier system with market assignments
- **Product**: Cannabis-specific fields (THC percentage, batch tracking, expiration dates)
- **CustomerDiscount**: Flexible discount rules with brand/category/subcategory targeting
- **InventoryDiscount**: Automated discounting for expiration and THC levels
- **BogoPromotion**: Buy-one-get-one promotional campaigns
- **BundleDeal**: Multi-product bundles with various discount types

#### API Architecture
REST API endpoints in `app/api/`:
- `/api/products` - Product management
- `/api/customers` - Customer tier management
- `/api/promotions` - Promotion campaign management
- `/api/discount-rules` - Customer discount configuration
- `/api/bundles` - Bundle deal management

### Design System & Styling

#### Color System (GTI Cannabis Theme)
- Primary: Dark Green (`#0f2922`) - buttons, navigation
- Medium Green (`#1a4d3a`) - hover states
- Bright Green (`#4ade80`) - headers, accents
- Light Green (`#86efac`) - success states

#### Component Standards
- Built on Radix UI components
- Tailwind CSS with CSS variables
- Dark/light theme support via next-themes
- Consistent spacing using Tailwind spacing scale

### State Management Patterns
- **Context API**: Application-wide state (AppProvider, AuthProvider)
- **Local State**: Component-specific state with useState/useEffect
- **Server State**: Real-time data fetching with built-in error handling
- **Form State**: React Hook Form with Zod validation

## Critical Implementation Notes

### Pricing Calculation Logic
The pricing engine applies discounts in this order (no stacking):
1. Volume pricing rules (quantity-based tiers)
2. Customer tier discounts (A/B/C customer segments)
3. **Best discount wins** - discounts do not stack

### Cannabis-Specific Features
- **THC Percentage Tracking**: Automated discounting for lower potency products
- **Batch Management**: Expiration-based automated pricing adjustments
- **Market Segregation**: Each market can choose volume OR tiered pricing (not both)
- **Compliance**: Built-in audit trails for regulatory requirements

### Database Performance
- Optimized queries for pricing calculations
- Indexed fields for fast lookups by customer tier, product category, dates
- Batch processing for inventory-based price updates
- Rate limiting on pricing API endpoints

### Error Handling Patterns
- Global error boundaries for React components
- Structured error logging with context
- User-friendly error messages
- Graceful degradation for pricing failures

## Development Guidelines

### Clean Code Principles (Enforced)
- **Meaningful Names**: Use intention-revealing names (`calculateTierDiscount` not `calc`)
- **Small Functions**: 5-20 lines max, single responsibility
- **No Magic Numbers**: Use named constants (`MAX_DISCOUNT_PERCENT = 50`)
- **Null Safety**: Always check before calling methods like `toLowerCase()`
- **Type Safety**: Strict TypeScript, avoid `any`

### Component Development
- Follow Atomic Design: Atoms → Molecules → Organisms → Templates → Pages
- Use compound components for complex UI patterns
- Implement proper loading and error states
- Maintain consistent prop interfaces

### API Development
- RESTful endpoints with proper HTTP status codes
- Request/response validation with Zod schemas
- Comprehensive error handling with structured responses
- Rate limiting and security headers

## Common Development Tasks

### Adding New Discount Types
1. Update `DiscountType` enum in Prisma schema
2. Extend pricing engine calculation logic
3. Add UI components for configuration
4. Update API validation schemas
5. Write integration tests for new discount logic

### Creating New Promotions
1. Define promotion model in Prisma schema
2. Implement business logic in pricing engine
3. Create management UI components
4. Add API endpoints for CRUD operations
5. Update dashboard metrics and reporting

### Database Schema Changes
1. Update `prisma/schema.prisma`
2. Generate migration: `npx prisma migrate dev --name <migration_name>`
3. Update TypeScript types
4. Modify affected API endpoints
5. Update UI components using changed data structures

## Testing Strategy

### Unit Testing
- Test pricing calculation logic extensively
- Mock external dependencies (database, APIs)
- Test edge cases for discount applications
- Validate cannabis-specific business rules

### Integration Testing
- Test complete pricing workflows end-to-end
- Validate database operations
- Test API endpoints with real database
- Verify discount rule combinations

### Performance Testing
- Pricing calculations must complete in <200ms
- Bulk price updates for inventory management
- Dashboard loading performance
- API response time monitoring

## Security Considerations

- **Authentication**: Role-based access control
- **Authorization**: Feature-level permissions for pricing managers
- **Data Validation**: All inputs validated with Zod schemas
- **SQL Injection**: Prisma ORM provides protection
- **Rate Limiting**: API endpoints protected against abuse
- **Audit Logging**: All pricing changes logged for compliance

## Integration Points

### External Systems
- **ERP Integration**: Product and customer data synchronization
- **Inventory Management**: Real-time stock levels for automated pricing
- **Order Management**: Real-time pricing for quotes and orders
- **Reporting Systems**: Analytics data export capabilities

### WebSocket Support
- Real-time price updates for connected clients
- Live dashboard metrics
- Notification system for pricing alerts

## Performance Optimization

### Database
- Proper indexing on frequently queried fields
- Connection pooling for high-concurrency scenarios
- Query optimization for complex pricing calculations
- Caching layer for static pricing rules

### Frontend
- Next.js automatic code splitting
- Image optimization for product catalogs
- Lazy loading for complex dashboard components
- Optimistic updates for better user experience

## Troubleshooting Common Issues

### Build Errors
- Check TypeScript strict mode compliance
- Verify all imports are correctly typed
- Ensure Prisma client is generated after schema changes

### Runtime Errors
- Check database connection configuration
- Verify environment variables are set
- Review Prisma client generation
- Check for null/undefined access patterns

### Performance Issues
- Monitor pricing calculation response times
- Check database query performance
- Review component re-render patterns
- Analyze bundle sizes for optimization opportunities

This codebase represents a sophisticated pricing engine with cannabis industry-specific features. When making changes, always consider the impact on pricing accuracy, compliance requirements, and user experience for pricing managers who rely on this system for daily operations.