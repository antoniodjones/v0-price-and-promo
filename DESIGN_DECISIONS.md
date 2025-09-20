# Design Decisions - GTI Promotions Engine

## Color System

### Primary Brand Colors
- **Dark Green**: `#0f2922` - Primary buttons, navigation elements
- **Medium Green**: `#1a4d3a` - Button hover states, secondary elements
- **Bright Green**: `#4ade80` - Headers, accent text ("Pricing & Promotions")
- **Light Green**: `#86efac` - Subtle accents, success states

### Typography Hierarchy
- **Main Header**: "Pricing & Promotions" in bright green (`text-emerald-400`)
- **Page Titles**: Black text for main content titles
- **Descriptions**: Muted foreground for subtitle text

### Button Standards
- **Primary Buttons**: Dark green background (`bg-gti-dark-green`) with medium green hover
- **All buttons must maintain dark green theme** - no light green buttons
- Focus states include proper ring styling for accessibility

### Layout Patterns
- Consistent page header structure: Bright green "Pricing & Promotions" followed by black page title
- Sidebar retains "Promotions Engine" branding
- Use flexbox for most layouts, CSS Grid only for complex 2D layouts

## Component Standards

### Headers
\`\`\`tsx
<h1 className="text-2xl font-bold text-emerald-400 mb-2">Pricing & Promotions</h1>
<h2 className="text-3xl font-bold text-foreground mb-2">[Page Title]</h2>
<p className="text-muted-foreground">[Description]</p>
\`\`\`

### Buttons
- Default variant uses `bg-gti-dark-green` with `hover:bg-gti-medium-green`
- Never use light green for buttons unless explicitly requested
- Maintain consistent sizing: default (h-9), sm (h-8), lg (h-10)

## Accessibility
- All colors meet WCAG contrast requirements
- Focus states clearly visible with ring styling
- Proper semantic HTML structure maintained
