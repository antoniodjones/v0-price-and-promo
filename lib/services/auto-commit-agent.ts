/**
 * @task cs-010
 * @epic Code Sync
 * @description Agent Auto-Commit Integration - automatically triggers GitHub workflow after agent edits
 */

import { createGitHubWorkflowService, type FileChange, type GitHubWorkflowConfig } from "./github-workflow"

export interface CodeChangeDetection {
  taskId: string
  files: FileChange[]
  triggeredBy: "agent" | "user"
  timestamp: Date
}

export interface AutoCommitConfig {
  enabled: boolean
  batchWindow: number // milliseconds to wait before committing (to batch multiple changes)
  autoCreatePR: boolean
}

/**
 * Agent Auto-Commit Service
 * Monitors code changes and automatically commits them to GitHub
 */
export class AutoCommitAgent {
  private pendingChanges: Map<string, CodeChangeDetection> = new Map()
  private commitTimers: Map<string, NodeJS.Timeout> = new Map()
  private config: AutoCommitConfig

  constructor(config: Partial<AutoCommitConfig> = {}) {
    this.config = {
      enabled: config.enabled ?? true,
      batchWindow: config.batchWindow ?? 5000, // 5 seconds default
      autoCreatePR: config.autoCreatePR ?? false,
    }
  }

  /**
   * Detect and queue code changes for auto-commit
   */
  async detectChanges(detection: CodeChangeDetection): Promise<void> {
    if (!this.config.enabled) {
      console.log(`[v0] Auto-commit disabled, skipping detection`)
      return
    }

    console.log(`[v0] Detected ${detection.files.length} file changes for task ${detection.taskId}`)

    // Add to pending changes
    const existing = this.pendingChanges.get(detection.taskId)
    if (existing) {
      // Merge file changes
      const mergedFiles = this.mergeFileChanges(existing.files, detection.files)
      this.pendingChanges.set(detection.taskId, {
        ...detection,
        files: mergedFiles,
      })
    } else {
      this.pendingChanges.set(detection.taskId, detection)
    }

    // Reset or create commit timer
    this.scheduleCommit(detection.taskId)
  }

  /**
   * Schedule a commit after the batch window
   */
  private scheduleCommit(taskId: string): void {
    // Clear existing timer
    const existingTimer = this.commitTimers.get(taskId)
    if (existingTimer) {
      clearTimeout(existingTimer)
    }

    // Schedule new commit
    const timer = setTimeout(() => {
      this.executeAutoCommit(taskId)
    }, this.config.batchWindow)

    this.commitTimers.set(taskId, timer)
    console.log(`[v0] Scheduled auto-commit for ${taskId} in ${this.config.batchWindow}ms`)
  }

  /**
   * Execute the auto-commit workflow
   */
  private async executeAutoCommit(taskId: string): Promise<void> {
    const detection = this.pendingChanges.get(taskId)
    if (!detection) {
      console.log(`[v0] No pending changes for ${taskId}`)
      return
    }

    console.log(`[v0] Executing auto-commit for ${taskId} with ${detection.files.length} files`)

    try {
      const service = createGitHubWorkflowService()

      const config: GitHubWorkflowConfig = {
        taskId: detection.taskId,
        auto: true, // This is an automatic commit
        createPR: this.config.autoCreatePR,
      }

      const result = await service.executeWorkflow(config, detection.files)

      if (result.success) {
        console.log(`[v0] ✓ Auto-commit successful for ${taskId}`)
        console.log(`[v0]   Branch: ${result.branchName}`)
        console.log(`[v0]   Commit: ${result.commitSha?.substring(0, 7)}`)
        if (result.prUrl) {
          console.log(`[v0]   PR: ${result.prUrl}`)
        }
      } else {
        console.error(`[v0] ✗ Auto-commit failed for ${taskId}: ${result.error}`)
      }

      // Clean up
      this.pendingChanges.delete(taskId)
      this.commitTimers.delete(taskId)
    } catch (error) {
      console.error(`[v0] Error in auto-commit for ${taskId}:`, error)
    }
  }

  /**
   * Merge file changes, keeping the latest operation for each file
   */
  private mergeFileChanges(existing: FileChange[], newChanges: FileChange[]): FileChange[] {
    const fileMap = new Map<string, FileChange>()

    // Add existing files
    for (const file of existing) {
      fileMap.set(file.path, file)
    }

    // Merge new changes (overwrites existing)
    for (const file of newChanges) {
      fileMap.set(file.path, file)
    }

    return Array.from(fileMap.values())
  }

  /**
   * Manually trigger commit for a task (bypasses batch window)
   */
  async triggerImmediateCommit(taskId: string): Promise<void> {
    const timer = this.commitTimers.get(taskId)
    if (timer) {
      clearTimeout(timer)
      this.commitTimers.delete(taskId)
    }

    await this.executeAutoCommit(taskId)
  }

  /**
   * Cancel pending commit for a task
   */
  cancelPendingCommit(taskId: string): void {
    const timer = this.commitTimers.get(taskId)
    if (timer) {
      clearTimeout(timer)
      this.commitTimers.delete(taskId)
    }

    this.pendingChanges.delete(taskId)
    console.log(`[v0] Cancelled pending commit for ${taskId}`)
  }

  /**
   * Get pending changes for a task
   */
  getPendingChanges(taskId: string): CodeChangeDetection | undefined {
    return this.pendingChanges.get(taskId)
  }

  /**
   * Enable or disable auto-commit
   */
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled
    console.log(`[v0] Auto-commit ${enabled ? "enabled" : "disabled"}`)
  }
}

// Singleton instance
let autoCommitAgentInstance: AutoCommitAgent | null = null

/**
 * Get or create the auto-commit agent singleton
 */
export function getAutoCommitAgent(): AutoCommitAgent {
  if (!autoCommitAgentInstance) {
    autoCommitAgentInstance = new AutoCommitAgent()
  }
  return autoCommitAgentInstance
}
