"use client"

import { useEffect, useRef } from "react"

/**
 * Hook to automatically detect and commit code changes from v0
 * This eliminates user dependency - changes auto-push to GitHub
 */
export function useAutoCommit() {
  const lastChangeRef = useRef<string>("")
  const debounceTimerRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // Monitor for v0 code changes in the DOM
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        // Look for v0's code project updates
        if (mutation.type === "childList" || mutation.type === "characterData") {
          const target = mutation.target as HTMLElement

          // Check if this is a code change from v0
          if (
            target.closest("[data-v0-code-project]") ||
            target.closest(".code-project") ||
            target.querySelector("pre code")
          ) {
            detectAndCommitChanges()
            break
          }
        }
      }
    })

    // Observe the entire document for v0 code changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    })

    return () => {
      observer.disconnect()
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  async function detectAndCommitChanges() {
    // Debounce to batch multiple rapid changes
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        // Extract file changes from v0's code blocks
        const codeBlocks = document.querySelectorAll("pre code[data-file-path]")
        const files = Array.from(codeBlocks).map((block) => {
          const filePath = block.getAttribute("data-file-path")
          const operation = block.getAttribute("data-operation") || "update"
          const content = block.textContent || ""

          return {
            path: filePath,
            operation,
            content,
          }
        })

        if (files.length === 0) return

        // Get current task ID from URL or context
        const taskId = getCurrentTaskId()
        if (!taskId) {
          console.log("[v0] No task ID found, skipping auto-commit")
          return
        }

        // Trigger auto-commit
        const response = await fetch("/api/code-changes/detect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            taskId,
            files,
            triggeredBy: "agent",
          }),
        })

        if (response.ok) {
          const data = await response.json()
          console.log(`[v0] ✓ Auto-commit triggered for ${data.fileCount} files`)
        }
      } catch (error) {
        console.error("[v0] Auto-commit detection failed:", error)
      }
    }, 2000) // 2 second debounce
  }

  function getCurrentTaskId(): string | null {
    // Try to extract task ID from various sources

    // 1. From URL params
    const params = new URLSearchParams(window.location.search)
    const urlTaskId = params.get("taskId")
    if (urlTaskId) return urlTaskId

    // 2. From page context/metadata
    const metaTaskId = document.querySelector('meta[name="task-id"]')?.getAttribute("content")
    if (metaTaskId) return metaTaskId

    // 3. From v0's commit messages in code blocks
    const commitMessages = document.querySelectorAll("[data-commit-message]")
    for (const msg of commitMessages) {
      const message = msg.textContent || ""
      const match = message.match(/refactor-\d+-[a-z](-phase-\d+)?/)
      if (match) return match[0]
    }

    return null
  }
}
