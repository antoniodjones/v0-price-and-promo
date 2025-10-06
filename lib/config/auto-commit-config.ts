/**
 * Auto-commit configuration for the application
 * Controls automatic pushing of code changes to GitHub
 */

export const AUTO_COMMIT_CONFIG = {
  // Global auto-commit settings
  enabled: true,
  batchWindow: 5000, // 5 seconds - batch changes within this window
  autoCreatePR: false, // Don't auto-create PRs by default

  // Task-specific overrides
  taskOverrides: {
    // Refactor tasks: auto-commit enabled
    "refactor-*": {
      enabled: true,
      batchWindow: 3000, // Faster commits for refactoring
    },

    // Feature tasks: auto-commit enabled
    "feature-*": {
      enabled: true,
      batchWindow: 5000,
    },

    // Bug fix tasks: auto-commit enabled
    "bug-*": {
      enabled: true,
      batchWindow: 2000, // Quick commits for bug fixes
    },
  },
} as const

/**
 * Check if auto-commit is enabled for a task
 */
export function isAutoCommitEnabled(taskId: string): boolean {
  // Check task-specific overrides
  for (const [pattern, config] of Object.entries(AUTO_COMMIT_CONFIG.taskOverrides)) {
    const regex = new RegExp(pattern.replace("*", ".*"))
    if (regex.test(taskId)) {
      return config.enabled
    }
  }

  // Fall back to global setting
  return AUTO_COMMIT_CONFIG.enabled
}

/**
 * Get batch window for a task
 */
export function getBatchWindow(taskId: string): number {
  // Check task-specific overrides
  for (const [pattern, config] of Object.entries(AUTO_COMMIT_CONFIG.taskOverrides)) {
    const regex = new RegExp(pattern.replace("*", ".*"))
    if (regex.test(taskId)) {
      return config.batchWindow
    }
  }

  // Fall back to global setting
  return AUTO_COMMIT_CONFIG.batchWindow
}
