import { createClient } from "@supabase/supabase-js"

/**
 * @task cs-003
 * @epic Code Sync
 * @description Retroactive code audit - analyzes GitHub commit history and populates code_change_log
 * @files scripts/cs-003-retroactive-audit.ts
 */

console.log("[v0] Starting retroactive audit script...")
console.log("[v0] Checking environment variables...")

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error("[v0] ERROR: NEXT_PUBLIC_SUPABASE_URL is not set")
  process.exit(1)
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("[v0] ERROR: SUPABASE_SERVICE_ROLE_KEY is not set")
  process.exit(1)
}

if (!process.env.GITHUB_TOKEN) {
  console.warn("[v0] WARNING: GITHUB_TOKEN is not set - API rate limits will be lower")
}

console.log("[v0] ✓ Environment variables validated")

interface GitHubCommit {
  sha: string
  commit: {
    author: {
      name: string
      email: string
      date: string
    }
    message: string
  }
  author: {
    login: string
  } | null
  files?: {
    filename: string
    status: "added" | "modified" | "removed" | "renamed"
    additions: number
    deletions: number
    changes: number
  }[]
}

interface EpicPattern {
  epic: string
  taskPrefix: string // e.g., "fw-retro", "pe-retro", "disc-retro"
  filePatterns: RegExp[]
  commitKeywords: RegExp[]
  priority: number // Higher priority = more specific match
}

interface TaskPattern {
  pattern: RegExp
  taskId: string
  title: string
  epic: string
}

interface ExistingTask {
  task_id: string
  title: string
  epic: string
  related_files: string[] | null
  description: string | null
}

interface TaskMatch {
  task: ExistingTask
  score: number
}

let supabase: ReturnType<typeof createClient>

try {
  console.log("[v0] Initializing Supabase client...")
  supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  console.log("[v0] ✓ Supabase client initialized")
} catch (error) {
  console.error("[v0] ERROR: Failed to initialize Supabase client:", error)
  process.exit(1)
}

// GitHub repository details
const GITHUB_OWNER = "antoniodjones"
const GITHUB_REPO = "v0-price-and-promo"
const GITHUB_API = "https://api.github.com"

const EPIC_PATTERNS: EpicPattern[] = [
  // Specific feature epics (higher priority)
  {
    epic: "Code Sync",
    taskPrefix: "cs-retro",
    filePatterns: [/scripts\/.*code.*sync/i, /api\/webhooks\/github/i, /code.*change.*log/i],
    commitKeywords: [/code.*sync|github.*webhook|jira.*integration/i],
    priority: 100,
  },
  {
    epic: "Approval Workflow",
    taskPrefix: "apr-retro",
    filePatterns: [/approval/i, /apr-\d{3}/i],
    commitKeywords: [/approval.*workflow|approval.*queue|approval.*gate/i],
    priority: 95,
  },
  {
    epic: "Dedupe Features",
    taskPrefix: "dedupe-retro",
    filePatterns: [/unified.*wizard|consolidated/i, /dedupe/i],
    commitKeywords: [/consolidat|dedupe|unify.*component/i],
    priority: 90,
  },
  {
    epic: "Wizard UI Enhancement",
    taskPrefix: "wiz-retro",
    filePatterns: [
      /wizard/i,
      /customer.*discount.*wizard/i,
      /bundle.*deal.*wizard/i,
      /promotion.*wizard/i,
      /pricing.*wizard/i,
    ],
    commitKeywords: [/wizard.*ui|wizard.*enhancement|wizard.*step/i],
    priority: 85,
  },
  {
    epic: "Database & Core APIs",
    taskPrefix: "db-retro",
    filePatterns: [
      /scripts\/.*\.sql$/i,
      /database|schema|migration/i,
      /api\/.*\/route\.ts$/i,
      /lib\/actions/i,
      /supabase/i,
    ],
    commitKeywords: [/database|schema|migration|api.*endpoint|crud/i],
    priority: 80,
  },
  {
    epic: "Pricing Engine",
    taskPrefix: "pe-retro",
    filePatterns: [/pricing.*engine/i, /app\/pricing/i, /components\/pricing/i, /lib\/.*pricing/i, /calculate.*price/i],
    commitKeywords: [/pricing.*engine|price.*calculation|pricing.*logic/i],
    priority: 75,
  },
  {
    epic: "Pricing Engine Integration",
    taskPrefix: "pei-retro",
    filePatterns: [/tier.*pricing|volume.*pricing|tiered.*pricing/i, /discount.*rule.*tier/i],
    commitKeywords: [/tier.*integration|volume.*pricing|tiered.*discount/i],
    priority: 74,
  },
  {
    epic: "Discounts",
    taskPrefix: "disc-retro",
    filePatterns: [/discount/i, /app\/.*discount/i, /components\/.*discount/i, /promo.*code/i, /coupon/i],
    commitKeywords: [/discount|promo.*code|coupon/i],
    priority: 70,
  },
  {
    epic: "Analytics",
    taskPrefix: "ana-retro",
    filePatterns: [/analytics|reporting|dashboard/i, /app\/analytics/i, /components\/analytics/i],
    commitKeywords: [/analytics|reporting|dashboard|metrics/i],
    priority: 65,
  },
  {
    epic: "Testing & Management",
    taskPrefix: "test-retro",
    filePatterns: [/test|spec\.ts|\.test\./i, /simulator/i, /management.*tool/i],
    commitKeywords: [/test|testing|unit.*test|integration.*test|simulator/i],
    priority: 60,
  },
  {
    epic: "Admin",
    taskPrefix: "admin-retro",
    filePatterns: [/admin|settings/i, /app\/admin/i, /components\/admin/i, /audit.*log/i],
    commitKeywords: [/admin|settings|configuration|audit/i],
    priority: 55,
  },
  {
    epic: "Authentication",
    taskPrefix: "auth-retro",
    filePatterns: [/auth|login|signup|session/i, /middleware\.ts/i],
    commitKeywords: [/auth|login|signup|session|middleware/i],
    priority: 50,
  },
  {
    epic: "Layout",
    taskPrefix: "layout-retro",
    filePatterns: [/layout\.tsx|navigation|sidebar|header/i, /app\/layout/i],
    commitKeywords: [/layout|navigation|sidebar|header/i],
    priority: 45,
  },
  {
    epic: "Atomic Design",
    taskPrefix: "ui-retro",
    filePatterns: [/components\/ui/i, /button|input|card|badge/i],
    commitKeywords: [/ui.*component|atomic.*design|design.*system/i],
    priority: 40,
  },
  {
    epic: "System Optimization",
    taskPrefix: "opt-retro",
    filePatterns: [/performance|optimization|cache/i],
    commitKeywords: [/performance|optimization|cache|speed/i],
    priority: 35,
  },
  {
    epic: "Foundation",
    taskPrefix: "fw-retro",
    filePatterns: [/next\.config|tsconfig|package\.json/i, /globals\.css|tailwind/i, /lib\/utils|lib\/constants/i],
    commitKeywords: [/foundation|infrastructure|setup|config|initial/i],
    priority: 30,
  },
  // Catch-all for unmatched items (lowest priority)
  {
    epic: "Advanced Features",
    taskPrefix: "misc-retro",
    filePatterns: [/.*/],
    commitKeywords: [/.*/],
    priority: 1,
  },
]

// Known task patterns for explicit task ID matching
const TASK_PATTERNS: TaskPattern[] = [
  {
    pattern: /\b(cs)-\d{3}\b/i,
    taskId: "cs-001",
    title: "Code Sync Infrastructure",
    epic: "Code Sync",
  },
  {
    pattern: /\b(apr)-\d{3}\b/i,
    taskId: "apr-001",
    title: "Approval Workflow Implementation",
    epic: "Approval Workflow",
  },
  {
    pattern: /\b(dedupe)-\d{3}\b/i,
    taskId: "dedupe-001",
    title: "Wizard Framework Consolidation",
    epic: "Dedupe Features",
  },
  {
    pattern: /\b(tm)-\d{3}\b/i,
    taskId: "tm-001",
    title: "Tier Management Implementation",
    epic: "Database & Core APIs",
  },
  {
    pattern: /\b(fw|framework)-\d{3}\b/i,
    taskId: "framework-001",
    title: "Framework Implementation",
    epic: "Foundation",
  },
]

async function fetchGitHubCommits(page = 1): Promise<GitHubCommit[]> {
  console.log(`[v0] Fetching commits page ${page}...`)

  try {
    const response = await fetch(
      `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits?per_page=100&page=${page}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          }),
        },
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`GitHub API error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    console.log(`[v0] ✓ Fetched ${data.length} commits from page ${page}`)
    return data
  } catch (error) {
    console.error(`[v0] ERROR fetching commits:`, error)
    throw error
  }
}

async function fetchCommitDetails(sha: string): Promise<GitHubCommit> {
  console.log(`[v0] Fetching details for commit ${sha.substring(0, 7)}...`)

  const response = await fetch(`${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits/${sha}`, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      ...(process.env.GITHUB_TOKEN && {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      }),
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

function inferEpic(commit: GitHubCommit): { epic: string; taskPrefix: string } {
  const filePaths = commit.files?.map((f) => f.filename).join(" ") || ""
  const commitMessage = commit.commit.message

  let bestMatch = EPIC_PATTERNS[EPIC_PATTERNS.length - 1] // Default to catch-all
  let highestScore = 0

  for (const pattern of EPIC_PATTERNS) {
    let score = 0

    // Check file patterns
    for (const filePattern of pattern.filePatterns) {
      if (filePattern.test(filePaths)) {
        score += pattern.priority
        break
      }
    }

    // Check commit keywords
    for (const keyword of pattern.commitKeywords) {
      if (keyword.test(commitMessage)) {
        score += pattern.priority * 0.5 // Keywords worth half of file patterns
        break
      }
    }

    if (score > highestScore) {
      highestScore = score
      bestMatch = pattern
    }
  }

  return {
    epic: bestMatch.epic,
    taskPrefix: bestMatch.taskPrefix,
  }
}

function inferTaskId(commit: GitHubCommit): { taskId: string; epic: string } {
  // First, check commit message for explicit task ID
  const messageMatch = commit.commit.message.match(/\b(dedupe|apr|tm|cs|fw|framework)-\d{3}\b/i)
  if (messageMatch) {
    const taskPattern = TASK_PATTERNS.find((p) => p.pattern.test(messageMatch[0]))
    if (taskPattern) {
      return { taskId: taskPattern.taskId, epic: taskPattern.epic }
    }
  }

  const { epic, taskPrefix } = inferEpic(commit)

  // Generate retroactive task ID with epic-specific prefix
  const taskId = `${taskPrefix}-001` // Will be deduplicated later

  return { taskId, epic }
}

async function fetchExistingTasks(): Promise<ExistingTask[]> {
  console.log("[v0] Fetching existing tasks from database...")

  try {
    const { data, error } = await supabase
      .from("user_stories")
      .select("task_id, title, epic, related_files, description")
      .order("task_id")

    if (error) {
      console.error("[v0] ERROR fetching existing tasks:", error)
      throw error
    }

    console.log(`[v0] ✓ Found ${data?.length || 0} existing tasks`)
    return (data as ExistingTask[]) || []
  } catch (error) {
    console.error("[v0] ERROR in fetchExistingTasks:", error)
    throw error
  }
}

function matchCommitToTask(commit: GitHubCommit, existingTasks: ExistingTask[]): TaskMatch | null {
  const commitMessage = commit.commit.message.toLowerCase()
  const filePaths = commit.files?.map((f) => f.filename) || []

  let bestMatch: TaskMatch | null = null
  let highestScore = 0

  for (const task of existingTasks) {
    let score = 0

    // 1. Check for explicit task ID in commit message (highest priority)
    const taskIdPattern = new RegExp(`\\b${task.task_id}\\b`, "i")
    if (taskIdPattern.test(commit.commit.message)) {
      score += 1000 // Very high score for explicit match
    }

    // 2. Check if any commit files match task's related_files
    if (task.related_files && task.related_files.length > 0) {
      for (const relatedFile of task.related_files) {
        if (filePaths.some((fp) => fp === relatedFile || fp.includes(relatedFile))) {
          score += 100 // High score for file match
        }
      }
    }

    // 3. Check for keyword matches in commit message vs task title/description
    const taskKeywords = [
      ...task.title.toLowerCase().split(/\s+/),
      ...(task.description?.toLowerCase().split(/\s+/) || []),
    ].filter((word) => word.length > 3) // Only meaningful words

    for (const keyword of taskKeywords) {
      if (commitMessage.includes(keyword)) {
        score += 10 // Medium score for keyword match
      }
    }

    // 4. Check for file path patterns matching task epic/type
    const taskPrefix = task.task_id.split("-")[0]
    for (const filePath of filePaths) {
      // Match file patterns to task prefixes
      if (taskPrefix === "dedupe" && /unified.*wizard|consolidated/i.test(filePath)) score += 50
      if (taskPrefix === "apr" && /approval/i.test(filePath)) score += 50
      if (taskPrefix === "cs" && /code.*sync|webhook|github/i.test(filePath)) score += 50
      if (taskPrefix === "vtp" && /tier.*pricing|volume/i.test(filePath)) score += 50
      if (taskPrefix === "tm" && /tier.*management/i.test(filePath)) score += 50
      if (taskPrefix === "fw" && /framework|foundation/i.test(filePath)) score += 50
    }

    if (score > highestScore) {
      highestScore = score
      bestMatch = { task, score }
    }
  }

  // Only return match if score is meaningful (> 10)
  return bestMatch && bestMatch.score > 10 ? bestMatch : null
}

const createdRetroTasks = new Set<string>()

async function createRetroactiveTask(taskId: string, epic: string, commitSample: GitHubCommit) {
  // Avoid duplicates
  if (createdRetroTasks.has(taskId)) {
    return taskId
  }

  createdRetroTasks.add(taskId)

  // Generate descriptive title based on epic and commit
  const title = generateRetroTaskTitle(epic, commitSample)

  const retroTask = {
    task_id: taskId,
    title: title,
    description: `Retroactive task for ${epic} work identified from git history. First commit: ${commitSample.commit.message}`,
    epic: epic,
    status: "completed",
    story_points: 3,
    retroactive: true,
    completed_at: new Date(commitSample.commit.author.date).toISOString(),
  }

  const { error } = await supabase.from("user_stories").upsert(retroTask, { onConflict: "task_id" })

  if (error) {
    console.error(`[v0] Error creating retroactive task ${taskId}:`, error)
  } else {
    console.log(`[v0] Created retroactive task: ${taskId} - ${title} (${epic})`)
  }

  return taskId
}

function generateRetroTaskTitle(epic: string, commit: GitHubCommit): string {
  const titles: Record<string, string> = {
    "Code Sync": "Code Sync Infrastructure Setup",
    "Approval Workflow": "Approval Workflow Implementation",
    "Dedupe Features": "Component Consolidation Work",
    "Wizard UI Enhancement": "Wizard UI Development",
    "Database & Core APIs": "Database Schema & API Development",
    "Pricing Engine": "Pricing Engine Implementation",
    "Pricing Engine Integration": "Tier Pricing Integration",
    Discounts: "Discount System Development",
    Analytics: "Analytics & Reporting Implementation",
    "Testing & Management": "Testing & Management Tools",
    Admin: "Admin Interface Development",
    Authentication: "Authentication System Setup",
    Layout: "Layout & Navigation Implementation",
    "Atomic Design": "UI Component Library Development",
    "System Optimization": "Performance Optimization Work",
    Foundation: "Project Foundation & Setup",
    "Advanced Features": "Miscellaneous Development Work",
  }

  return titles[epic] || `${epic} Development`
}

async function inferOrCreateTaskId(
  commit: GitHubCommit,
  existingTasks: ExistingTask[],
): Promise<{ taskId: string; epic: string; isNew: boolean }> {
  // First, try to match to existing task
  const match = matchCommitToTask(commit, existingTasks)

  if (match) {
    console.log(
      `[v0] Matched commit ${commit.sha.substring(0, 7)} to existing task ${match.task.task_id} (score: ${match.score})`,
    )
    return {
      taskId: match.task.task_id,
      epic: match.task.epic,
      isNew: false,
    }
  }

  // No match found - need to create retroactive task
  const { epic, taskPrefix } = inferEpic(commit)

  // Find next available task number for this prefix
  const existingWithPrefix = existingTasks.filter((t) => t.task_id.startsWith(taskPrefix))
  const maxNumber = existingWithPrefix.reduce((max, t) => {
    const match = t.task_id.match(/-(\d+)$/)
    return match ? Math.max(max, Number.parseInt(match[1])) : max
  }, 0)

  const nextNumber = maxNumber + 1
  const taskId = `${taskPrefix}-${String(nextNumber).padStart(3, "0")}`

  console.log(`[v0] Creating new retroactive task ${taskId} for unmatched commit ${commit.sha.substring(0, 7)}`)

  return { taskId, epic, isNew: true }
}

async function populateCodeChangeLog() {
  console.log("[v0] Starting retroactive code audit...")

  // Fetch all existing tasks first
  const existingTasks = await fetchExistingTasks()

  let page = 1
  let totalCommits = 0
  let totalFileChanges = 0
  let matchedToExisting = 0
  let createdNewTasks = 0

  const newTaskCommitSamples = new Map<string, GitHubCommit>()

  while (true) {
    const commits = await fetchGitHubCommits(page)

    if (commits.length === 0) {
      break
    }

    console.log(`[v0] Processing ${commits.length} commits from page ${page}...`)

    for (const commit of commits) {
      // Fetch full commit details with file changes
      const fullCommit = await fetchCommitDetails(commit.sha)

      if (!fullCommit.files || fullCommit.files.length === 0) {
        continue
      }

      const { taskId, epic, isNew } = await inferOrCreateTaskId(fullCommit, existingTasks)
      const author = fullCommit.commit.author.name
      const authorEmail = fullCommit.commit.author.email
      const commitDate = new Date(fullCommit.commit.author.date)

      if (isNew) {
        if (!newTaskCommitSamples.has(taskId)) {
          newTaskCommitSamples.set(taskId, fullCommit)
        }
        createdNewTasks++
      } else {
        matchedToExisting++
      }

      console.log(
        `[v0] Commit ${fullCommit.sha.substring(0, 7)}: ${fullCommit.files.length} files → ${taskId} (${epic}) ${isNew ? "[NEW]" : "[EXISTING]"}`,
      )

      // Insert each file change into code_change_log
      for (const file of fullCommit.files) {
        const changeType = file.status === "added" ? "created" : file.status === "removed" ? "deleted" : "modified"

        const commitUrl = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/commit/${fullCommit.sha}`

        const { error } = await supabase.from("code_change_log").insert({
          task_id: taskId,
          file_path: file.filename,
          change_type: changeType,
          lines_added: file.additions,
          lines_removed: file.deletions,
          commit_sha: fullCommit.sha,
          commit_message: fullCommit.commit.message,
          commit_url: commitUrl, // Direct link to commit on GitHub
          branch_name: "main",
          author: author,
          author_email: authorEmail,
          changed_at: commitDate.toISOString(),
        })

        if (error) {
          console.error(`[v0] Error inserting file change:`, error)
        } else {
          totalFileChanges++
        }
      }

      totalCommits++

      // Rate limiting: wait 100ms between commits
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    page++
  }

  console.log("[v0] Creating retroactive tasks for unmatched commits...")
  for (const [taskId, commitSample] of newTaskCommitSamples.entries()) {
    const { epic } = inferEpic(commitSample)
    await createRetroactiveTask(taskId, epic, commitSample)
  }

  console.log(`[v0] ✅ Retroactive audit complete!`)
  console.log(`[v0] Processed ${totalCommits} commits`)
  console.log(`[v0] Recorded ${totalFileChanges} file changes`)
  console.log(`[v0] Matched ${matchedToExisting} commits to existing tasks`)
  console.log(`[v0] Created ${createdRetroTasks.size} new retroactive tasks`)

  // Update user_stories with aggregated metrics
  await updateTaskMetrics()
}

async function updateTaskMetrics() {
  console.log("[v0] Updating task metrics...")

  const { data: tasks, error } = await supabase.from("user_stories").select("task_id")

  if (error || !tasks) {
    console.error("[v0] Error fetching tasks:", error)
    return
  }

  for (const task of tasks) {
    // Aggregate metrics from code_change_log
    const { data: changes } = await supabase
      .from("code_change_log")
      .select("file_path, lines_added, lines_removed, commit_sha")
      .eq("task_id", task.task_id)

    if (!changes || changes.length === 0) continue

    const uniqueFiles = new Set(changes.map((c) => c.file_path))
    const uniqueCommits = new Set(changes.map((c) => c.commit_sha))
    const totalLinesAdded = changes.reduce((sum, c) => sum + (c.lines_added || 0), 0)
    const totalLinesRemoved = changes.reduce((sum, c) => sum + (c.lines_removed || 0), 0)

    const branchCounts = new Map<string, number>()
    for (const change of changes) {
      const { data: logEntry } = await supabase
        .from("code_change_log")
        .select("branch_name")
        .eq("commit_sha", change.commit_sha)
        .single()

      if (logEntry?.branch_name) {
        branchCounts.set(logEntry.branch_name, (branchCounts.get(logEntry.branch_name) || 0) + 1)
      }
    }

    const primaryBranch =
      branchCounts.size > 0 ? Array.from(branchCounts.entries()).sort((a, b) => b[1] - a[1])[0][0] : "main"

    await supabase
      .from("user_stories")
      .update({
        related_files: Array.from(uniqueFiles),
        git_commits: Array.from(uniqueCommits), // Array of commit SHAs
        git_branch: primaryBranch, // Primary branch name
        files_modified: uniqueFiles.size,
        lines_added: totalLinesAdded,
        lines_removed: totalLinesRemoved,
      })
      .eq("task_id", task.task_id)

    console.log(
      `[v0] Updated metrics for ${task.task_id}: ${uniqueFiles.size} files, ${uniqueCommits.size} commits, branch: ${primaryBranch}`,
    )
  }
}

async function main() {
  try {
    console.log("[v0] ========================================")
    console.log("[v0] Starting Retroactive Code Audit (cs-003)")
    console.log("[v0] ========================================")

    // Test database connection
    console.log("[v0] Testing database connection...")
    const existingTasks = await fetchExistingTasks()
    console.log(`[v0] ✓ Database connection successful - found ${existingTasks.length} tasks`)

    // Test GitHub API connection
    console.log("[v0] Testing GitHub API connection...")
    const firstPage = await fetchGitHubCommits(1)
    console.log(`[v0] ✓ GitHub API connection successful - found ${firstPage.length} commits`)

    console.log("[v0] ========================================")
    console.log("[v0] Environment check complete!")
    console.log("[v0] Ready to process commits...")
    console.log("[v0] ========================================")

    await populateCodeChangeLog()
  } catch (error) {
    console.error("[v0] ========================================")
    console.error("[v0] FATAL ERROR in main():", error)
    console.error("[v0] ========================================")
    process.exit(1)
  }
}

main()
  .then(() => {
    console.log("[v0] ========================================")
    console.log("[v0] Script completed successfully!")
    console.log("[v0] ========================================")
    process.exit(0)
  })
  .catch((error) => {
    console.error("[v0] ========================================")
    console.error("[v0] Script failed with error:", error)
    console.error("[v0] ========================================")
    process.exit(1)
  })
