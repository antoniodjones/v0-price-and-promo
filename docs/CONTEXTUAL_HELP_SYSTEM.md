# Contextual Help System Documentation

## Overview

The Contextual Help System provides users with easy access to relevant documentation directly from each page in the application. A book icon appears in the top-right corner of pages, linking to user guides and training materials.

## Features

### For End Users

- **Book Icon**: Visible in the top-right corner of supported pages
- **One-Click Access**: Opens documentation in a new tab
- **Contextual**: Each page links to its specific user guide
- **Tooltip**: Hover to see page name and description

### For Administrators

- **Global Toggle**: Enable/disable documentation links across the entire application
- **Per-Page Control**: Enable/disable links for individual pages
- **Custom URLs**: Configure documentation URLs for each page
- **Category Organization**: Pages grouped by category (Core, Catalog, Pricing, Promotions, etc.)

## Configuration

### Accessing Settings

1. Navigate to **Settings** → **Operations** → **Documentation**
2. You'll see the Documentation Links configuration page

### Global Configuration

**Enable/Disable All Links**:
- Toggle "Enable Documentation Links" to control all documentation links at once
- When disabled, no book icons will appear on any page

### Per-Page Configuration

For each page, you can:

1. **Enable/Disable**: Toggle the switch next to the page name
2. **Edit URL**: Change the documentation URL in the input field
3. **Preview**: Click the external link icon to open the documentation
4. **View Status**: Badge shows "Enabled" or "Disabled" status

### Saving Changes

- Click "Save Configuration" to apply your changes
- Click "Reset Changes" to revert to the last saved configuration

## Available Pages

### Core
- **Dashboard**: Overview of pricing engine metrics

### Catalog
- **Products**: Product catalog management
- **Customers**: Customer management and tiers

### Pricing
- **Pricing Engine**: Pricing calculations and rules

### Promotions
- **Discounts**: Discount rule management
- **Bundle Deals**: Product bundle configuration
- **Best Deal Logic**: Deal selection algorithm
- **Promotions**: Promotional campaigns

### Testing
- **Promo Simulator**: Test promotions before launch

### Reporting
- **Analytics**: Analytics and reporting

### System
- **Settings**: System configuration

## Implementation Details

### Database Storage

Documentation configuration is stored in the `system_config` table:

\`\`\`sql
config_key: 'documentation_links'
config_value: {
  globalEnabled: boolean,
  links: [
    {
      pageId: string,
      pageName: string,
      documentationUrl: string,
      enabled: boolean,
      category: string,
      description: string
    }
  ]
}
\`\`\`

### Adding Documentation to New Pages

To add documentation links to a new page:

1. **Import the component**:
\`\`\`tsx
import { DocumentationLink } from "@/components/shared/documentation-link"
\`\`\`

2. **Add to page header**:
\`\`\`tsx
<DocumentationLink pageId="your-page-id" />
\`\`\`

3. **Configure in settings**:
   - Go to Settings → Documentation
   - Add the new page configuration
   - Set the documentation URL
   - Enable the link

### Creating Documentation Files

Documentation files should be:
- Placed in the `/docs` directory
- Written in Markdown format
- Named descriptively (e.g., `products-user-guide.md`)
- Include clear sections and examples

## Best Practices

### For Administrators

1. **Keep URLs Updated**: Ensure documentation URLs point to current, accurate guides
2. **Test Links**: Use the preview button to verify documentation opens correctly
3. **Enable Strategically**: Enable links for pages where users need the most help
4. **Review Regularly**: Update documentation as features change

### For Documentation Writers

1. **Be Specific**: Write guides specific to each page's functionality
2. **Use Screenshots**: Include visual aids to help users
3. **Keep Updated**: Update guides when features change
4. **Include Examples**: Provide real-world usage examples

## Troubleshooting

### Book Icon Not Appearing

**Check**:
1. Global toggle is enabled in Settings → Documentation
2. Specific page toggle is enabled
3. Page has a `pageId` prop passed to `DocumentationLink`
4. User has appropriate permissions

### Documentation Link Not Working

**Check**:
1. URL is correct and accessible
2. Documentation file exists at the specified path
3. File permissions allow public access
4. Browser isn't blocking pop-ups

### Changes Not Saving

**Check**:
1. User has admin/superuser permissions
2. Database connection is active
3. No validation errors in the form
4. Browser console for error messages

## Security Considerations

- Only users with admin/superuser roles can modify documentation settings
- Documentation URLs are validated before saving
- External links open in new tabs with `noopener,noreferrer` for security
- Configuration changes are logged in the audit trail

## Future Enhancements

Potential improvements:
- In-app documentation viewer (no new tab required)
- Search within documentation
- Version-specific documentation
- Multi-language support
- Usage analytics (which docs are accessed most)
- Contextual help based on user role

---

*Last Updated: 2025-01-09*
*Version: 1.0*
