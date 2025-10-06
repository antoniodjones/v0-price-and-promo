"use client"

import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { GitBranch, GitCommit, GitPullRequest, Code2, Send as Sync, Eye, MoreVertical, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { githubUrls } from "@/lib/utils/github-urls"

interface TaskActionsMenuProps {
  taskId: string
  taskTitle: string
  autoCommitEnabled?: boolean
  onAutoCommitToggle?: (enabled: boolean) => void
}

export function TaskActionsMenu({
  taskId,
  taskTitle,
  autoCommitEnabled = true,
  onAutoCommitToggle,
}: TaskActionsMenuProps) {
  const [isCreateBranchOpen, setIsCreateBranchOpen] = useState(false)
  const [isCreateCommitOpen, setIsCreateCommitOpen] = useState(false)
  const [isCreatePROpen, setIsCreatePROpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Branch creation state
  const [branchName, setBranchName] = useState(`feature/${taskId.toLowerCase()}`)
  const [branchFrom, setBranchFrom] = useState("main")

  // Commit creation state
  const [commitMessage, setCommitMessage] = useState(`[${taskId}] ${taskTitle}`)
  const [commitDescription, setCommitDescription] = useState("")

  // PR creation state
  const [prTitle, setPrTitle] = useState(`[${taskId}] ${taskTitle}`)
  const [prDescription, setPrDescription] = useState("")
  const [prTargetBranch, setPrTargetBranch] = useState("main")

  const handleCreateBranch = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/github/commit-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId,
          action: "create_branch",
          branchName,
          baseBranch: branchFrom,
        }),
      })

      if (!response.ok) throw new Error("Failed to create branch")

      const data = await response.json()
      toast.success(`Branch "${branchName}" created successfully`)
      setIsCreateBranchOpen(false)
    } catch (error) {
      toast.error("Failed to create branch")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCommit = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/github/commit-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId,
          commitMessage: `${commitMessage}\n\n${commitDescription}`.trim(),
          branchName: `feature/${taskId.toLowerCase()}`,
        }),
      })

      if (!response.ok) throw new Error("Failed to create commit")

      const data = await response.json()
      toast.success("Changes committed successfully")
      setIsCreateCommitOpen(false)
    } catch (error) {
      toast.error("Failed to create commit")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePR = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/github/commit-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId,
          action: "create_pr",
          prTitle,
          prDescription,
          branchName: `feature/${taskId.toLowerCase()}`,
          targetBranch: prTargetBranch,
        }),
      })

      if (!response.ok) throw new Error("Failed to create PR")

      const data = await response.json()
      toast.success("Pull request created successfully")
      setIsCreatePROpen(false)
    } catch (error) {
      toast.error("Failed to create pull request")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewChanges = async () => {
    try {
      const response = await fetch(`/api/code-changes/detect?taskId=${taskId}&view=history`)
      if (!response.ok) throw new Error("Failed to fetch changes")

      const data = await response.json()

      if (data.commits && data.commits.length > 0) {
        const latestCommit = data.commits[0]
        const commitUrl = githubUrls.commit(latestCommit.commit_sha)

        toast.success(`${data.commits.length} commit(s) found`, {
          description: `Latest: ${latestCommit.commit_message}`,
          action: {
            label: "View on GitHub",
            onClick: () => window.open(commitUrl, "_blank"),
          },
        })
      } else if (data.pendingCommit) {
        toast.info(`${data.pendingCommit.files.length} file(s) changed`, {
          description: data.pendingCommit.files.slice(0, 3).join(", "),
        })
      } else {
        toast.info("No changes found for this task")
      }
    } catch (error) {
      toast.error("Failed to fetch changes")
      console.error(error)
    }
  }

  const handleSyncToGitHub = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/code-changes/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId,
          action: "sync",
        }),
      })

      if (!response.ok) throw new Error("Failed to sync")

      const data = await response.json()

      if (data.commitUrl) {
        toast.success("Changes synced to GitHub", {
          action: {
            label: "View Commit",
            onClick: () => window.open(data.commitUrl, "_blank"),
          },
        })
      } else {
        toast.success("Changes synced to GitHub")
      }
    } catch (error) {
      toast.error("Failed to sync to GitHub")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  console.log("[v0] TaskActionsMenu: Rendering for task", taskId, "autoCommitEnabled:", autoCommitEnabled)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <MoreVertical className="h-4 w-4" />
            <span className="text-xs">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>GitHub Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Create Branch */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <GitBranch className="h-4 w-4 mr-2" />
              Create Branch
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setIsCreateBranchOpen(true)}>
                <Code2 className="h-4 w-4 mr-2" />
                Custom Branch
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setBranchName(`feature/${taskId.toLowerCase()}`)
                  setIsCreateBranchOpen(true)
                }}
              >
                <GitBranch className="h-4 w-4 mr-2" />
                Feature Branch
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setBranchName(`bugfix/${taskId.toLowerCase()}`)
                  setIsCreateBranchOpen(true)
                }}
              >
                <GitBranch className="h-4 w-4 mr-2" />
                Bugfix Branch
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Create Commit */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <GitCommit className="h-4 w-4 mr-2" />
              Create Commit
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setIsCreateCommitOpen(true)}>
                <GitCommit className="h-4 w-4 mr-2" />
                Custom Message
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setCommitMessage(`[${taskId}] Implement ${taskTitle}`)
                  setIsCreateCommitOpen(true)
                }}
              >
                <GitCommit className="h-4 w-4 mr-2" />
                Implementation
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setCommitMessage(`[${taskId}] Fix ${taskTitle}`)
                  setIsCreateCommitOpen(true)
                }}
              >
                <GitCommit className="h-4 w-4 mr-2" />
                Bug Fix
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Create PR */}
          <DropdownMenuItem onClick={() => setIsCreatePROpen(true)}>
            <GitPullRequest className="h-4 w-4 mr-2" />
            Create Pull Request
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* View Changes */}
          <DropdownMenuItem onClick={handleViewChanges}>
            <Eye className="h-4 w-4 mr-2" />
            View Changes
          </DropdownMenuItem>

          {/* Sync to GitHub */}
          <DropdownMenuItem onClick={handleSyncToGitHub} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sync className="h-4 w-4 mr-2" />}
            Sync to GitHub
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Auto-commit Toggle */}
          <div className="px-2 py-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-commit" className="text-sm cursor-pointer">
                Auto-commit
              </Label>
              <Switch id="auto-commit" checked={autoCommitEnabled} onCheckedChange={onAutoCommitToggle} />
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Create Branch Dialog */}
      <Dialog open={isCreateBranchOpen} onOpenChange={setIsCreateBranchOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Branch</DialogTitle>
            <DialogDescription>Create a new branch for this task</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="branch-name">Branch Name</Label>
              <Input
                id="branch-name"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                placeholder="feature/task-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch-from">Branch From</Label>
              <Input
                id="branch-from"
                value={branchFrom}
                onChange={(e) => setBranchFrom(e.target.value)}
                placeholder="main"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateBranchOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateBranch} disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Branch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Commit Dialog */}
      <Dialog open={isCreateCommitOpen} onOpenChange={setIsCreateCommitOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Commit</DialogTitle>
            <DialogDescription>Commit your changes with a message</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="commit-message">Commit Message</Label>
              <Input
                id="commit-message"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="[TASK-001] Brief description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commit-description">Description (optional)</Label>
              <Textarea
                id="commit-description"
                value={commitDescription}
                onChange={(e) => setCommitDescription(e.target.value)}
                placeholder="Detailed description of changes..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateCommitOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCommit} disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Commit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create PR Dialog */}
      <Dialog open={isCreatePROpen} onOpenChange={setIsCreatePROpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Pull Request</DialogTitle>
            <DialogDescription>Open a pull request for this task</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pr-title">PR Title</Label>
              <Input
                id="pr-title"
                value={prTitle}
                onChange={(e) => setPrTitle(e.target.value)}
                placeholder="[TASK-001] Feature description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pr-description">Description</Label>
              <Textarea
                id="pr-description"
                value={prDescription}
                onChange={(e) => setPrDescription(e.target.value)}
                placeholder="Describe the changes in this PR..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pr-target">Target Branch</Label>
              <Input
                id="pr-target"
                value={prTargetBranch}
                onChange={(e) => setPrTargetBranch(e.target.value)}
                placeholder="main"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatePROpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePR} disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create PR
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
