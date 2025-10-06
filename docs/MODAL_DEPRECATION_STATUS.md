# Modal Deprecation Status

## Summary

This document tracks the deprecation status of modal components in the codebase.

**Last Updated:** refactor-003-c-phase-5

## Statistics

- **Total Modals:** 17
- **Migrated:** 11 (65%)
- **Pending:** 5 (29%)
- **Excluded:** 1 (6%)

## Migrated Modals ✅

These modals have been successfully migrated to UnifiedModal:

| Component | Type | Phase | Status |
|-----------|------|-------|--------|
| `customer-discount-edit-modal.tsx` | Edit | Phase 2 | ✅ Complete |
| `bundle-deal-edit-modal.tsx` | Edit | Phase 2 | ✅ Complete |
| `bogo-promotion-edit-modal.tsx` | Edit | Phase 2 | ✅ Complete |
| `inventory-discount-edit-modal.tsx` | Edit | Phase 2 | ✅ Complete |
| `new-rule-modal.tsx` | Form | Phase 3 | ✅ Complete |
| `product-add-modal.tsx` | Form | Phase 3 | ✅ Complete |
| `tier-assignment-modal.tsx` | Form | Phase 3 | ✅ Complete |
| `discount-rule-modal.tsx` | Form | Phase 3 | ✅ Complete |
| `market-configuration-modal.tsx` | Form | Phase 3 | ✅ Complete |
| `product-detail-modal.tsx` | Detail | Phase 4 | ✅ Complete |
| `product-details-modal.tsx` | Detail | Phase 4 | ✅ Complete |

## Pending Migration ⚠️

These modals still use old Dialog/Sheet patterns and should be migrated:

| Component | Type | Complexity | Priority | Notes |
|-----------|------|------------|----------|-------|
| `market-pricing-edit-modal.tsx` | Edit | High | Medium | Uses wizard components, requires custom migration |
| `volume-pricing-modal.tsx` | Form | High | Medium | Complex tier management with dynamic arrays |
| `tiered-pricing-modal.tsx` | Form | Medium | Medium | Customer tier selection with badges |
| `bulk-upload-modal.tsx` | Form | High | Low | File upload with progress tracking |
| `user-story-modal.tsx` | Form | High | Low | Complex form with multiple dynamic arrays |

## Excluded Components 🚫

These components use Dialog/Sheet but are not modals and should NOT be migrated:

| Component | Reason |
|-----------|--------|
| `task-detail-sheet.tsx` | Side sheet, not a modal |
| `product-management.tsx` | Inline dialogs for quick actions |
| `add-product-dialog.tsx` | Simple confirmation dialog |
| `bulk-operations-panel.tsx` | Panel component, not modal |
| `admin/module-management-dashboard.tsx` | Admin-specific dialogs |
| `admin/user-management-dashboard.tsx` | Admin-specific dialogs |
| `auth/development-user-switcher.tsx` | Development tool |
| `task-actions-menu.tsx` | Menu with confirmation dialogs |

## Migration Priority

### High Priority (Next Sprint)
- None currently - Phase 1-4 complete

### Medium Priority (Future Sprints)
- `market-pricing-edit-modal.tsx` - Frequently used, complex wizard
- `volume-pricing-modal.tsx` - Core pricing functionality
- `tiered-pricing-modal.tsx` - Core pricing functionality

### Low Priority (Backlog)
- `bulk-upload-modal.tsx` - Infrequently used
- `user-story-modal.tsx` - Internal tool, low usage

## Migration Guidelines

### For High Complexity Modals

1. **Assess current functionality** - Document all features and edge cases
2. **Plan custom implementation** - UnifiedModal with custom content
3. **Preserve existing behavior** - Ensure no regression
4. **Add comprehensive tests** - Cover all user flows
5. **Update documentation** - Document any changes

### For Medium Complexity Modals

1. **Use modal helpers** - `createEditModal`, `createFormModal`
2. **Extract form logic** - Separate form component from modal
3. **Add validation** - Use validate prop
4. **Test thoroughly** - Verify all scenarios

### For Low Complexity Modals

1. **Use modal helpers** - Quick migration with helpers
2. **Minimal changes** - Keep existing form components
3. **Basic testing** - Verify open/close/submit

## Deprecation Warnings

Development mode now shows deprecation warnings for old modal patterns:

\`\`\`typescript
// Automatically shown in development
<DeprecatedModalWarning componentName="MyOldModal" />
\`\`\`

## Next Steps

1. ✅ Complete Phase 1-4 migrations
2. ✅ Create migration guide and documentation
3. ⏳ Prioritize Phase 5 complex modals
4. ⏳ Schedule migration sprints
5. ⏳ Update team training materials
6. ⏳ Plan removal of old patterns (Phase 6)

## Resources

- [Modal Migration Guide](./MODAL_MIGRATION_GUIDE.md)
- [Modal Patterns Documentation](./MODAL_PATTERNS.md)
- [UnifiedModal API Reference](../components/shared/unified-modal.tsx)
- [Modal Helpers Reference](../components/shared/modal-helpers.tsx)

---

**Maintained By:** Development Team
**Review Frequency:** Monthly
