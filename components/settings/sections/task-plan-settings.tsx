"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Filter, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Task {
  id: string
  planId: string
  epic: string
  name: string
  storyPoints: number
  estimateDuration: string
  dueDate: string
  completedDate: string | null
  completed: boolean
  phase: string
  acceptanceCriteria?: string[]
}

const ALL_TASKS: Task[] = [
  // EPIC: Completed Core Features (from Task Planning Board)
  {
    id: "core-1",
    planId: "CORE-001",
    epic: "Completed Core Features",
    name: "Customer Discount Management",
    storyPoints: 13,
    estimateDuration: "5 days",
    dueDate: "2025-09-15",
    completedDate: "2025-09-15",
    completed: true,
    phase: "Core Features",
  },
  {
    id: "core-2",
    planId: "CORE-002",
    epic: "Completed Core Features",
    name: "Inventory Discount System",
    storyPoints: 13,
    estimateDuration: "5 days",
    dueDate: "2025-09-20",
    completedDate: "2025-09-20",
    completed: true,
    phase: "Core Features",
  },
  {
    id: "core-3",
    planId: "CORE-003",
    epic: "Completed Core Features",
    name: "Basic Pricing Engine",
    storyPoints: 13,
    estimateDuration: "5 days",
    dueDate: "2025-09-25",
    completedDate: "2025-09-25",
    completed: true,
    phase: "Core Features",
  },
  {
    id: "core-4",
    planId: "CORE-004",
    epic: "Completed Core Features",
    name: "Simple Analytics Dashboard",
    storyPoints: 8,
    estimateDuration: "3 days",
    dueDate: "2025-09-27",
    completedDate: "2025-09-27",
    completed: true,
    phase: "Core Features",
  },

  // EPIC: Enhanced Features (from Task Planning Board)
  {
    id: "enh-1",
    planId: "ENH-001",
    epic: "Enhanced Features",
    name: "Advanced Wizard-Based Discount Creation",
    storyPoints: 21,
    estimateDuration: "8 days",
    dueDate: "2025-10-01",
    completedDate: "2025-10-01",
    completed: true,
    phase: "Enhanced Features",
  },
  {
    id: "enh-2",
    planId: "ENH-002",
    epic: "Enhanced Features",
    name: "Bundle Deal Management",
    storyPoints: 13,
    estimateDuration: "5 days",
    dueDate: "2025-10-01",
    completedDate: "2025-10-01",
    completed: true,
    phase: "Enhanced Features",
  },
  {
    id: "enh-3",
    planId: "ENH-003",
    epic: "Enhanced Features",
    name: "Market-Based Pricing Intelligence",
    storyPoints: 13,
    estimateDuration: "5 days",
    dueDate: "2025-10-01",
    completedDate: "2025-10-01",
    completed: true,
    phase: "Enhanced Features",
  },
  {
    id: "enh-4",
    planId: "ENH-004",
    epic: "Enhanced Features",
    name: "Comprehensive Settings System",
    storyPoints: 13,
    estimateDuration: "5 days",
    dueDate: "2025-10-01",
    completedDate: "2025-10-01",
    completed: true,
    phase: "Enhanced Features",
  },
  {
    id: "enh-5",
    planId: "ENH-005",
    epic: "Enhanced Features",
    name: "Advanced Search & Navigation",
    storyPoints: 8,
    estimateDuration: "3 days",
    dueDate: "2025-10-01",
    completedDate: "2025-10-01",
    completed: true,
    phase: "Enhanced Features",
  },
  {
    id: "enh-6",
    planId: "ENH-006",
    epic: "Enhanced Features",
    name: "Promotion Campaign Management",
    storyPoints: 13,
    estimateDuration: "5 days",
    dueDate: "2025-10-01",
    completedDate: "2025-10-01",
    completed: true,
    phase: "Enhanced Features",
  },
  {
    id: "enh-7",
    planId: "ENH-007",
    epic: "Enhanced Features",
    name: "Testing & Experimentation Tools",
    storyPoints: 8,
    estimateDuration: "3 days",
    dueDate: "2025-10-01",
    completedDate: "2025-10-01",
    completed: true,
    phase: "Enhanced Features",
  },
  {
    id: "enh-8",
    planId: "ENH-008",
    epic: "Enhanced Features",
    name: "Enterprise Multi-Tenant Architecture",
    storyPoints: 21,
    estimateDuration: "8 days",
    dueDate: "2025-10-01",
    completedDate: "2025-10-01",
    completed: true,
    phase: "Enhanced Features",
  },

  // EPIC: Tier Management Implementation (from Task Plan)
  // Phase 1: Database & Core APIs
  {
    id: "1.1",
    planId: "TM-001",
    epic: "Tier Management Implementation",
    name: "Create discount_rules table",
    storyPoints: 3,
    estimateDuration: "1 day",
    dueDate: "2025-10-03",
    completedDate: "2025-09-28",
    completed: true,
    phase: "Phase 1: Database & Core APIs",
  },
  {
    id: "1.2",
    planId: "TM-002",
    epic: "Tier Management Implementation",
    name: "Create discount_rule_tiers table",
    storyPoints: 3,
    estimateDuration: "1 day",
    dueDate: "2025-10-03",
    completedDate: "2025-09-28",
    completed: true,
    phase: "Phase 1: Database & Core APIs",
  },
  {
    id: "1.3",
    planId: "TM-003",
    epic: "Tier Management Implementation",
    name: "Create customer_tier_assignments table",
    storyPoints: 3,
    estimateDuration: "1 day",
    dueDate: "2025-10-03",
    completedDate: "2025-09-28",
    completed: true,
    phase: "Phase 1: Database & Core APIs",
  },
  {
    id: "1.4",
    planId: "TM-004",
    epic: "Tier Management Implementation",
    name: "Create database indexes for performance",
    storyPoints: 2,
    estimateDuration: "0.5 day",
    dueDate: "2025-10-04",
    completedDate: "2025-09-28",
    completed: true,
    phase: "Phase 1: Database & Core APIs",
  },
  {
    id: "1.5",
    planId: "TM-005",
    epic: "Tier Management Implementation",
    name: "Create seed data migration script",
    storyPoints: 3,
    estimateDuration: "1 day",
    dueDate: "2025-10-04",
    completedDate: "2025-09-28",
    completed: true,
    phase: "Phase 1: Database & Core APIs",
  },
  {
    id: "2.1",
    planId: "TM-006",
    epic: "Tier Management Implementation",
    name: "Build POST /api/discount-rules (Create rule)",
    storyPoints: 5,
    estimateDuration: "2 days",
    dueDate: "2025-10-07",
    completedDate: "2025-09-29",
    completed: true,
    phase: "Phase 1: Database & Core APIs",
  },
  {
    id: "2.2",
    planId: "TM-007",
    epic: "Tier Management Implementation",
    name: "Build GET /api/discount-rules (List all rules)",
    storyPoints: 3,
    estimateDuration: "1 day",
    dueDate: "2025-10-08",
    completedDate: "2025-09-29",
    completed: true,
    phase: "Phase 1: Database & Core APIs",
  },
  {
    id: "2.3",
    planId: "TM-008",
    epic: "Tier Management Implementation",
    name: "Build GET /api/discount-rules/[id] (Get rule details)",
    storyPoints: 3,
    estimateDuration: "1 day",
    dueDate: "2025-10-08",
    completedDate: "2025-09-29",
    completed: true,
    phase: "Phase 1: Database & Core APIs",
  },
  {
    id: "2.4",
    planId: "TM-009",
    epic: "Tier Management Implementation",
    name: "Build PUT /api/discount-rules/[id] (Update rule)",
    storyPoints: 5,
    estimateDuration: "2 days",
    dueDate: "2025-10-10",
    completedDate: "2025-09-29",
    completed: true,
    phase: "Phase 1: Database & Core APIs",
  },
  {
    id: "2.5",
    planId: "TM-010",
    epic: "Tier Management Implementation",
    name: "Build DELETE /api/discount-rules/[id] (Delete rule)",
    storyPoints: 2,
    estimateDuration: "0.5 day",
    dueDate: "2025-10-10",
    completedDate: "2025-09-29",
    completed: true,
    phase: "Phase 1: Database & Core APIs",
  },
  {
    id: "2.6",
    planId: "TM-011",
    epic: "Tier Management Implementation",
    name: "Build POST /api/discount-rules/[id]/assignments (Assign customers)",
    storyPoints: 5,
    estimateDuration: "2 days",
    dueDate: "2025-10-11",
    completedDate: "2025-09-29",
    completed: true,
    phase: "Phase 1: Database & Core APIs",
  },
  {
    id: "2.7",
    planId: "TM-012",
    epic: "Tier Management Implementation",
    name: "Build GET /api/discount-rules/[id]/assignments (Get assignments)",
    storyPoints: 3,
    estimateDuration: "1 day",
    dueDate: "2025-10-11",
    completedDate: "2025-09-29",
    completed: true,
    phase: "Phase 1: Database & Core APIs",
  },
  {
    id: "2.8",
    planId: "TM-013",
    epic: "Tier Management Implementation",
    name: "Build PUT /api/discount-rules/[id]/assignments/[customerId] (Update tier)",
    storyPoints: 3,
    estimateDuration: "1 day",
    dueDate: "2025-10-14",
    completedDate: "2025-09-29",
    completed: true,
    phase: "Phase 1: Database & Core APIs",
  },
  {
    id: "2.9",
    planId: "TM-014",
    epic: "Tier Management Implementation",
    name: "Build DELETE /api/discount-rules/[id]/assignments/[customerId] (Remove assignment)",
    storyPoints: 2,
    estimateDuration: "0.5 day",
    dueDate: "2025-10-14",
    completedDate: "2025-09-29",
    completed: true,
    phase: "Phase 1: Database & Core APIs",
  },
  {
    id: "2.10",
    planId: "TM-015",
    epic: "Tier Management Implementation",
    name: "Build GET /api/customers/[id]/tiers (Get customer tiers)",
    storyPoints: 3,
    estimateDuration: "1 day",
    dueDate: "2025-10-14",
    completedDate: "2025-10-01",
    completed: true,
    phase: "Phase 1: Database & Core APIs",
  },

  // Phase 2: Wizard UI Enhancement
  {
    id: "3.1",
    planId: "TM-016",
    epic: "Tier Management Implementation",
    name: "Create wizard Step 1: Rule Configuration UI",
    storyPoints: 5,
    estimateDuration: "2 days",
    dueDate: "2025-10-17",
    completedDate: "2025-10-01",
    completed: true,
    phase: "Phase 2: Wizard UI Enhancement",
  },
  {
    id: "3.2",
    planId: "TM-017",
    epic: "Tier Management Implementation",
    name: "Create wizard Step 2: Tier Configuration UI (A/B/C tiers)",
    storyPoints: 8,
    estimateDuration: "3 days",
    dueDate: "2025-10-21",
    completedDate: "2025-10-01",
    completed: true,
    phase: "Phase 2: Wizard UI Enhancement",
  },
  {
    id: "3.3",
    planId: "TM-018",
    epic: "Tier Management Implementation",
    name: "Create wizard Step 3: Customer Assignment to Tiers UI",
    storyPoints: 8,
    estimateDuration: "3 days",
    dueDate: "2025-10-24",
    completedDate: "2025-10-01",
    completed: true,
    phase: "Phase 2: Wizard UI Enhancement",
  },
  {
    id: "3.4",
    planId: "TM-019",
    epic: "Tier Management Implementation",
    name: "Create wizard Step 4: Dates & Review UI",
    storyPoints: 5,
    estimateDuration: "2 days",
    dueDate: "2025-10-25",
    completedDate: "2025-10-01",
    completed: true,
    phase: "Phase 2: Wizard UI Enhancement",
  },
  {
    id: "3.5",
    planId: "TM-020",
    epic: "Tier Management Implementation",
    name: "Build Tier Assignment Matrix component",
    storyPoints: 8,
    estimateDuration: "3 days",
    dueDate: "2025-10-28",
    completedDate: "2025-10-01",
    completed: true,
    phase: "Phase 2: Wizard UI Enhancement",
  },
  {
    id: "3.6",
    planId: "TM-021",
    epic: "Tier Management Implementation",
    name: "Add search and filter for customer assignment",
    storyPoints: 5,
    estimateDuration: "2 days",
    dueDate: "2025-10-29",
    completedDate: "2025-10-01",
    completed: true,
    phase: "Phase 2: Wizard UI Enhancement",
  },

  // Phase 3: Pricing Engine Integration
  {
    id: "4.1",
    planId: "TM-022",
    epic: "Tier Management Implementation",
    name: "Implement findApplicableRules() function",
    storyPoints: 5,
    estimateDuration: "2 days",
    dueDate: "2025-11-01",
    completedDate: null,
    completed: false,
    phase: "Phase 3: Pricing Engine Integration",
  },
  {
    id: "4.2",
    planId: "TM-023",
    epic: "Tier Management Implementation",
    name: "Implement getCustomerTierAssignment() function",
    storyPoints: 3,
    estimateDuration: "1 day",
    dueDate: "2025-11-04",
    completedDate: null,
    completed: false,
    phase: "Phase 3: Pricing Engine Integration",
  },
  {
    id: "4.3",
    planId: "TM-024",
    epic: "Tier Management Implementation",
    name: "Implement getTierDiscount() function",
    storyPoints: 3,
    estimateDuration: "1 day",
    dueDate: "2025-11-04",
    completedDate: null,
    completed: false,
    phase: "Phase 3: Pricing Engine Integration",
  },
  {
    id: "4.4",
    planId: "TM-025",
    epic: "Tier Management Implementation",
    name: "Implement calculateCustomerPrice() main function",
    storyPoints: 8,
    estimateDuration: "3 days",
    dueDate: "2025-11-07",
    completedDate: null,
    completed: false,
    phase: "Phase 3: Pricing Engine Integration",
  },
  {
    id: "4.5",
    planId: "TM-026",
    epic: "Tier Management Implementation",
    name: "Implement best discount selection logic (no stacking)",
    storyPoints: 5,
    estimateDuration: "2 days",
    dueDate: "2025-11-08",
    completedDate: null,
    completed: false,
    phase: "Phase 3: Pricing Engine Integration",
  },
  {
    id: "4.6",
    planId: "TM-027",
    epic: "Tier Management Implementation",
    name: "Add audit logging for pricing calculations",
    storyPoints: 5,
    estimateDuration: "2 days",
    dueDate: "2025-11-11",
    completedDate: null,
    completed: false,
    phase: "Phase 3: Pricing Engine Integration",
  },
  {
    id: "4.7",
    planId: "TM-028",
    epic: "Tier Management Implementation",
    name: "Optimize pricing calculation performance (<200ms)",
    storyPoints: 5,
    estimateDuration: "2 days",
    dueDate: "2025-11-12",
    completedDate: null,
    completed: false,
    phase: "Phase 3: Pricing Engine Integration",
  },

  // Phase 4: Testing & Management Tools
  {
    id: "5.1",
    planId: "TM-029",
    epic: "Tier Management Implementation",
    name: "Build Customer Tier Dashboard page",
    storyPoints: 8,
    estimateDuration: "3 days",
    dueDate: "2025-11-15",
    completedDate: null,
    completed: false,
    phase: "Phase 4: Testing & Management Tools",
  },
  {
    id: "5.2",
    planId: "TM-030",
    epic: "Tier Management Implementation",
    name: "Build Bulk Tier Assignment tool (CSV upload)",
    storyPoints: 8,
    estimateDuration: "3 days",
    dueDate: "2025-11-18",
    completedDate: null,
    completed: false,
    phase: "Phase 4: Testing & Management Tools",
  },
  {
    id: "5.3",
    planId: "TM-031",
    epic: "Tier Management Implementation",
    name: "Create comprehensive test suite for tier management",
    storyPoints: 8,
    estimateDuration: "3 days",
    dueDate: "2025-11-21",
    completedDate: null,
    completed: false,
    phase: "Phase 4: Testing & Management Tools",
  },
  {
    id: "5.4",
    planId: "TM-032",
    epic: "Tier Management Implementation",
    name: "Create comprehensive test suite for pricing engine",
    storyPoints: 8,
    estimateDuration: "3 days",
    dueDate: "2025-11-22",
    completedDate: "2025-10-01",
    completed: true,
    phase: "Phase 4: Testing & Management Tools",
  },
  {
    id: "5.5",
    planId: "TM-033",
    epic: "Tier Management Implementation",
    name: "Write user documentation for tier management",
    storyPoints: 5,
    estimateDuration: "2 days",
    dueDate: "2025-11-25",
    completedDate: "2025-10-01",
    completed: true,
    phase: "Phase 4: Testing & Management Tools",
  },
  {
    id: "5.6",
    planId: "TM-034",
    epic: "Tier Management Implementation",
    name: "Write technical documentation for pricing engine",
    storyPoints: 5,
    estimateDuration: "2 days",
    dueDate: "2025-11-26",
    completedDate: "2025-10-01",
    completed: true,
    phase: "Phase 4: Testing & Management Tools",
  },

  // EPIC: GitLab Integration
  // Phase 1: Core GitLab Service & Authentication
  {
    id: "gl-1",
    planId: "GL-001",
    epic: "GitLab Integration",
    name: "Create GitLab API Service Foundation",
    storyPoints: 8,
    estimateDuration: "3 days",
    dueDate: "2025-11-15",
    completedDate: null,
    completed: false,
    phase: "Phase 1: Core GitLab Service & Authentication",
    acceptanceCriteria: [
      "Given a developer needs GitLab integration, When they create lib/services/gitlab-workflow.ts, Then the file structure mirrors github-workflow.ts",
      "Given the service needs configuration, When environment variables are accessed, Then GITLAB_TOKEN, GITLAB_PROJECT_ID, and GITLAB_BASE_URL are used",
      "Given API calls need authentication, When making requests to GitLab, Then the private token is included in headers",
      "Given the service needs error handling, When API calls fail, Then errors are caught and logged with context",
    ],
  },
  {
    id: "gl-2",
    planId: "GL-002",
    epic: "GitLab Integration",
    name: "Implement GitLab Authentication & Token Management",
    storyPoints: 5,
    estimateDuration: "2 days",
    dueDate: "2025-11-18",
    completedDate: null,
    completed: false,
    phase: "Phase 1: Core GitLab Service & Authentication",
    acceptanceCriteria: [
      "Given a user needs to authenticate with GitLab, When they provide a personal access token, Then the token is validated against GitLab API",
      "Given the token needs permissions, When validating, Then api, read_repository, and write_repository scopes are verified",
      "Given token validation succeeds, When storing the token, Then it is encrypted and saved securely",
      "Given token validation fails, When the error occurs, Then a clear error message explains required permissions",
    ],
  },
  {
    id: "gl-3",
    planId: "GL-003",
    epic: "GitLab Integration",
    name: "Build GitLab Project & Repository Operations",
    storyPoints: 8,
    estimateDuration: "3 days",
    dueDate: "2025-11-21",
    completedDate: null,
    completed: false,
    phase: "Phase 1: Core GitLab Service & Authentication",
    acceptanceCriteria: [
      "Given a user needs project info, When calling getProject(), Then project details are fetched from GitLab API",
      "Given a user needs branches, When calling listBranches(), Then all branches are returned with commit info",
      "Given a user needs to create a branch, When calling createBranch(name, ref), Then a new branch is created from the reference",
      "Given a user needs file content, When calling getFile(path, ref), Then the file content is decoded from base64",
      "Given a user needs to commit, When calling createCommit(branch, message, actions), Then changes are committed to the branch",
    ],
  },

  // Phase 2: Merge Request Management
  {
    id: "gl-4",
    planId: "GL-004",
    epic: "GitLab Integration",
    name: "Implement Merge Request Creation & Updates",
    storyPoints: 8,
    estimateDuration: "3 days",
    dueDate: "2025-11-25",
    completedDate: null,
    completed: false,
    phase: "Phase 2: Merge Request Management",
    acceptanceCriteria: [
      "Given a user wants to create an MR, When calling createMergeRequest(title, sourceBranch, targetBranch, description), Then a new merge request is created",
      "Given an MR needs updates, When calling updateMergeRequest(mrId, updates), Then the MR title, description, or labels are updated",
      "Given an MR is ready, When calling mergeMergeRequest(mrId), Then the MR is merged if all conditions are met",
      "Given merge conflicts exist, When attempting to merge, Then a clear error message indicates conflicts must be resolved",
    ],
  },
  {
    id: "gl-5",
    planId: "GL-005",
    epic: "GitLab Integration",
    name: "Build Merge Request Listing & Filtering",
    storyPoints: 5,
    estimateDuration: "2 days",
    dueDate: "2025-11-27",
    completedDate: null,
    completed: false,
    phase: "Phase 2: Merge Request Management",
    acceptanceCriteria: [
      "Given a user needs to see MRs, When calling listMergeRequests(state), Then MRs are returned filtered by state (opened, closed, merged)",
      "Given MRs need sorting, When listing MRs, Then they are sorted by updated_at descending",
      "Given pagination is needed, When fetching many MRs, Then results are paginated with 100 items per page",
      "Given MR details are needed, When calling getMergeRequest(mrId), Then full MR details including approvals are returned",
    ],
  },
  {
    id: "gl-6",
    planId: "GL-006",
    epic: "GitLab Integration",
    name: "Add Merge Request Comments & Discussions",
    storyPoints: 5,
    estimateDuration: "2 days",
    dueDate: "2025-12-02",
    completedDate: null,
    completed: false,
    phase: "Phase 2: Merge Request Management",
    acceptanceCriteria: [
      "Given a user wants to comment, When calling addMergeRequestComment(mrId, body), Then a new note is added to the MR",
      "Given comments need listing, When calling listMergeRequestComments(mrId), Then all notes are returned chronologically",
      "Given a discussion is needed, When calling createDiscussion(mrId, body, position), Then a new discussion thread is created",
      "Given discussions need resolution, When calling resolveDiscussion(mrId, discussionId), Then the discussion is marked resolved",
    ],
  },

  // Phase 3: Issue Management
  {
    id: "gl-7",
    planId: "GL-007",
    epic: "GitLab Integration",
    name: "Implement GitLab Issue Creation & Management",
    storyPoints: 8,
    estimateDuration: "3 days",
    dueDate: "2025-12-05",
    completedDate: null,
    completed: false,
    phase: "Phase 3: Issue Management",
    acceptanceCriteria: [
      "Given a user needs to create an issue, When calling createIssue(title, description, labels), Then a new issue is created in GitLab",
      "Given an issue needs updates, When calling updateIssue(issueId, updates), Then the issue title, description, labels, or assignees are updated",
      "Given an issue is resolved, When calling closeIssue(issueId), Then the issue state is changed to closed",
      "Given an issue needs reopening, When calling reopenIssue(issueId), Then the issue state is changed to opened",
    ],
  },
  {
    id: "gl-8",
    planId: "GL-008",
    epic: "GitLab Integration",
    name: "Build Issue Listing & Search",
    storyPoints: 5,
    estimateDuration: "2 days",
    dueDate: "2025-12-09",
    completedDate: null,
    completed: false,
    phase: "Phase 3: Issue Management",
    acceptanceCriteria: [
      "Given a user needs to see issues, When calling listIssues(state), Then issues are returned filtered by state (opened, closed, all)",
      "Given issues need filtering, When providing labels parameter, Then only issues with matching labels are returned",
      "Given search is needed, When calling searchIssues(query), Then issues matching the search term are returned",
      "Given issue details are needed, When calling getIssue(issueId), Then full issue details including comments are returned",
    ],
  },
  {
    id: "gl-9",
    planId: "GL-009",
    epic: "GitLab Integration",
    name: "Add Issue Comments & Activity Tracking",
    storyPoints: 5,
    estimateDuration: "2 days",
    dueDate: "2025-12-11",
    completedDate: null,
    completed: false,
    phase: "Phase 3: Issue Management",
    acceptanceCriteria: [
      "Given a user wants to comment on an issue, When calling addIssueComment(issueId, body), Then a new note is added to the issue",
      "Given comments need listing, When calling listIssueComments(issueId), Then all notes are returned in chronological order",
      "Given activity tracking is needed, When fetching issue details, Then all state changes and updates are included",
      "Given mentions are used, When adding a comment with @username, Then the mentioned user is notified",
    ],
  },

  // Phase 4: Labels & Milestones
  {
    id: "gl-10",
    planId: "GL-010",
    epic: "GitLab Integration",
    name: "Implement GitLab Label Management",
    storyPoints: 3,
    estimateDuration: "1 day",
    dueDate: "2025-12-12",
    completedDate: null,
    completed: false,
    phase: "Phase 4: Labels & Milestones",
    acceptanceCriteria: [
      "Given a user needs labels, When calling listLabels(), Then all project labels are returned with colors",
      "Given a new label is needed, When calling createLabel(name, color, description), Then a new label is created",
      "Given a label needs updates, When calling updateLabel(labelId, updates), Then the label name, color, or description is updated",
      "Given a label is unused, When calling deleteLabel(labelId), Then the label is removed from the project",
    ],
  },
  {
    id: "gl-11",
    planId: "GL-011",
    epic: "GitLab Integration",
    name: "Build Milestone Management",
    storyPoints: 3,
    estimateDuration: "1 day",
    dueDate: "2025-12-13",
    completedDate: null,
    completed: false,
    phase: "Phase 4: Labels & Milestones",
    acceptanceCriteria: [
      "Given a user needs milestones, When calling listMilestones(state), Then milestones are returned filtered by state",
      "Given a new milestone is needed, When calling createMilestone(title, description, dueDate), Then a new milestone is created",
      "Given a milestone needs updates, When calling updateMilestone(milestoneId, updates), Then the milestone details are updated",
      "Given a milestone is complete, When calling closeMilestone(milestoneId), Then the milestone state is changed to closed",
    ],
  },

  // Phase 5: Webhooks & Events
  {
    id: "gl-12",
    planId: "GL-012",
    epic: "GitLab Integration",
    name: "Implement GitLab Webhook Configuration",
    storyPoints: 5,
    estimateDuration: "2 days",
    dueDate: "2025-12-16",
    completedDate: null,
    completed: false,
    phase: "Phase 5: Webhooks & Events",
    acceptanceCriteria: [
      "Given webhooks are needed, When calling createWebhook(url, events, token), Then a new webhook is registered in GitLab",
      "Given webhook configuration, When specifying events, Then push, merge_request, issue, and note events are supported",
      "Given webhook security, When creating a webhook, Then a secret token is generated and stored",
      "Given webhook management, When calling listWebhooks(), Then all configured webhooks are returned",
    ],
  },
  {
    id: "gl-13",
    planId: "GL-013",
    epic: "GitLab Integration",
    name: "Build Webhook Event Handlers",
    storyPoints: 8,
    estimateDuration: "3 days",
    dueDate: "2025-12-19",
    completedDate: null,
    completed: false,
    phase: "Phase 5: Webhooks & Events",
    acceptanceCriteria: [
      "Given a webhook is triggered, When receiving a push event, Then the payload is validated and processed",
      "Given webhook security, When validating requests, Then the X-Gitlab-Token header is verified against stored secret",
      "Given event processing, When handling merge_request events, Then MR state changes are tracked in the database",
      "Given error handling, When webhook processing fails, Then errors are logged and a 200 response is still returned",
    ],
  },
  {
    id: "gl-14",
    planId: "GL-014",
    epic: "GitLab Integration",
    name: "Create Webhook Event API Routes",
    storyPoints: 5,
    estimateDuration: "2 days",
    dueDate: "2025-12-23",
    completedDate: null,
    completed: false,
    phase: "Phase 5: Webhooks & Events",
    acceptanceCriteria: [
      "Given webhook endpoints are needed, When creating app/api/webhooks/gitlab/route.ts, Then POST requests are handled",
      "Given event routing, When receiving different event types, Then each is routed to appropriate handler",
      "Given logging is needed, When processing webhooks, Then all events are logged to audit trail",
      "Given testing is needed, When calling the endpoint with test payloads, Then responses match expected behavior",
    ],
  },

  // Phase 6: Auto-Commit Integration
  {
    id: "gl-15",
    planId: "GL-015",
    epic: "GitLab Integration",
    name: "Build GitLab Auto-Commit Detection",
    storyPoints: 8,
    estimateDuration: "3 days",
    dueDate: "2025-12-30",
    completedDate: null,
    completed: false,
    phase: "Phase 6: Auto-Commit Integration",
    acceptanceCriteria: [
      "Given code changes are detected, When the system checks for changes, Then GitLab API is queried for recent commits",
      "Given commits need filtering, When detecting changes, Then only commits with #VERCEL_SKIP are excluded",
      "Given change detection, When new commits are found, Then file diffs are fetched and analyzed",
      "Given multiple commits, When processing changes, Then commits are grouped by branch and time window",
    ],
  },
  {
    id: "gl-16",
    planId: "GL-016",
    epic: "GitLab Integration",
    name: "Implement GitLab Auto-Commit Trigger",
    storyPoints: 8,
    estimateDuration: "3 days",
    dueDate: "2026-01-06",
    completedDate: null,
    completed: false,
    phase: "Phase 6: Auto-Commit Integration",
    acceptanceCriteria: [
      "Given changes need committing, When calling triggerAutoCommit(files, message), Then changes are committed to GitLab",
      "Given branch strategy, When auto-committing, Then commits go to a feature branch, not main",
      "Given MR creation, When auto-commit completes, Then a merge request is automatically created",
      "Given commit messages, When generating messages, Then they include [AUTO-COMMIT] prefix and change summary",
    ],
  },
  {
    id: "gl-17",
    planId: "GL-017",
    epic: "GitLab Integration",
    name: "Create GitLab Auto-Commit API Routes",
    storyPoints: 5,
    estimateDuration: "2 days",
    dueDate: "2026-01-08",
    completedDate: null,
    completed: false,
    phase: "Phase 6: Auto-Commit Integration",
    acceptanceCriteria: [
      "Given API endpoints are needed, When creating app/api/code-changes/gitlab/detect/route.ts, Then GET requests detect changes",
      "Given trigger endpoint, When creating app/api/code-changes/gitlab/trigger/route.ts, Then POST requests trigger commits",
      "Given error handling, When API calls fail, Then appropriate HTTP status codes and error messages are returned",
      "Given rate limiting, When making frequent requests, Then GitLab API rate limits are respected",
    ],
  },

  // Phase 7: UI Integration & Provider Selection
  {
    id: "gl-18",
    planId: "GL-018",
    epic: "GitLab Integration",
    name: "Build Git Provider Selection UI",
    storyPoints: 5,
    estimateDuration: "2 days",
    dueDate: "2026-01-12",
    completedDate: null,
    completed: false,
    phase: "Phase 7: UI Integration & Provider Selection",
    acceptanceCriteria: [
      "Given provider selection is needed, When user visits settings, Then a dropdown shows GitHub and GitLab options",
      "Given provider switching, When user selects a provider, Then the selection is saved to user preferences",
      "Given provider status, When viewing settings, Then connection status for each provider is displayed",
      "Given configuration, When selecting GitLab, Then fields for token, project ID, and base URL are shown",
    ],
  },
  {
    id: "gl-19",
    planId: "GL-019",
    epic: "GitLab Integration",
    name: "Create GitLab Configuration Settings Page",
    storyPoints: 5,
    estimateDuration: "2 days",
    dueDate: "2026-01-14",
    completedDate: null,
    completed: false,
    phase: "Phase 7: UI Integration & Provider Selection",
    acceptanceCriteria: [
      "Given GitLab configuration, When user enters credentials, Then token validation occurs in real-time",
      "Given project selection, When token is valid, Then available projects are fetched and displayed",
      "Given base URL configuration, When using self-hosted GitLab, Then custom base URL can be entered",
      "Given connection testing, When clicking 'Test Connection', Then API connectivity is verified and results shown",
    ],
  },
  {
    id: "gl-20",
    planId: "GL-020",
    epic: "GitLab Integration",
    name: "Update Code Change Detection UI for Dual Providers",
    storyPoints: 5,
    estimateDuration: "2 days",
    dueDate: "2026-01-16",
    completedDate: null,
    completed: false,
    phase: "Phase 7: UI Integration & Provider Selection",
    acceptanceCriteria: [
      "Given dual providers, When viewing code changes, Then the active provider is clearly indicated",
      "Given change detection, When clicking 'Detect Changes', Then the correct provider API is called",
      "Given commit history, When viewing changes, Then commits link to correct provider (GitHub or GitLab)",
      "Given error states, When provider is not configured, Then helpful setup instructions are displayed",
    ],
  },

  // Phase 8: Testing & Documentation
  {
    id: "gl-21",
    planId: "GL-021",
    epic: "GitLab Integration",
    name: "Create Comprehensive GitLab Integration Tests",
    storyPoints: 13,
    estimateDuration: "5 days",
    dueDate: "2026-01-23",
    completedDate: null,
    completed: false,
    phase: "Phase 8: Testing & Documentation",
    acceptanceCriteria: [
      "Given unit tests are needed, When testing gitlab-workflow.ts, Then all methods have test coverage >80%",
      "Given integration tests, When testing API routes, Then mock GitLab API responses are used",
      "Given webhook tests, When testing event handlers, Then all event types have test cases",
      "Given error scenarios, When testing failure cases, Then error handling is verified for all API calls",
    ],
  },
  {
    id: "gl-22",
    planId: "GL-022",
    epic: "GitLab Integration",
    name: "Write GitLab Integration Documentation",
    storyPoints: 8,
    estimateDuration: "3 days",
    dueDate: "2026-01-27",
    completedDate: null,
    completed: false,
    phase: "Phase 8: Testing & Documentation",
    acceptanceCriteria: [
      "Given user documentation, When users need setup instructions, Then docs/GITLAB_SETUP.md provides step-by-step guide",
      "Given API documentation, When developers need reference, Then all GitLab service methods are documented with examples",
      "Given troubleshooting, When users encounter issues, Then common problems and solutions are documented",
      "Given comparison guide, When choosing providers, Then GitHub vs GitLab feature comparison is available",
    ],
  },
  {
    id: "gl-23",
    planId: "GL-023",
    epic: "GitLab Integration",
    name: "Create GitLab Integration Migration Guide",
    storyPoints: 5,
    estimateDuration: "2 days",
    dueDate: "2026-01-29",
    completedDate: null,
    completed: false,
    phase: "Phase 8: Testing & Documentation",
    acceptanceCriteria: [
      "Given users migrating from GitHub, When following migration guide, Then all GitHub features have GitLab equivalents documented",
      "Given data migration, When switching providers, Then existing data mapping is explained",
      "Given webhook migration, When moving webhooks, Then step-by-step instructions are provided",
      "Given rollback procedures, When migration fails, Then rollback steps are clearly documented",
    ],
  },
]

export default function TaskPlanSettings() {
  const [tasks, setTasks] = useState<Task[]>(ALL_TASKS)
  const [epicFilter, setEpicFilter] = useState<string>("all")
  const [taskNameFilter, setTaskNameFilter] = useState<string>("")
  const [completedFilter, setCompletedFilter] = useState<string>("all")

  // Load task completion state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("task-plan-completion")
    if (saved) {
      const completionState = JSON.parse(saved)
      setTasks((prevTasks) =>
        prevTasks.map((task) => ({
          ...task,
          completed: completionState[task.id]?.completed ?? task.completed,
          completedDate: completionState[task.id]?.completedDate ?? task.completedDate,
        })),
      )
    }
  }, [])

  // Save task completion state to localStorage
  useEffect(() => {
    const completionState = tasks.reduce(
      (acc, task) => {
        acc[task.id] = {
          completed: task.completed,
          completedDate: task.completedDate,
        }
        return acc
      },
      {} as Record<string, { completed: boolean; completedDate: string | null }>,
    )
    localStorage.setItem("task-plan-completion", JSON.stringify(completionState))
  }, [tasks])

  const toggleTaskCompletion = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              completedDate: !task.completed ? new Date().toISOString().split("T")[0] : null,
            }
          : task,
      ),
    )
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesEpic = epicFilter === "all" || task.epic === epicFilter
    const matchesTaskName = taskNameFilter === "" || task.name.toLowerCase().includes(taskNameFilter.toLowerCase())
    const matchesCompleted =
      completedFilter === "all" ||
      (completedFilter === "completed" && task.completed) ||
      (completedFilter === "incomplete" && !task.completed)

    return matchesEpic && matchesTaskName && matchesCompleted
  })

  const groupedTasks = filteredTasks.reduce(
    (acc, task) => {
      if (!acc[task.phase]) {
        acc[task.phase] = []
      }
      acc[task.phase].push(task)
      return acc
    },
    {} as Record<string, Task[]>,
  )

  const uniqueEpics = Array.from(new Set(tasks.map((task) => task.epic)))

  const totalStoryPoints = tasks.reduce((sum, task) => sum + task.storyPoints, 0)
  const completedStoryPoints = tasks.filter((t) => t.completed).reduce((sum, task) => sum + task.storyPoints, 0)
  const completionPercentage = Math.round((completedStoryPoints / totalStoryPoints) * 100)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Task Plan</h2>
          <p className="text-muted-foreground mt-1">Consolidated Implementation Tracker</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Progress</div>
          <div className="text-2xl font-bold">
            {completedStoryPoints} / {totalStoryPoints} SP
          </div>
          <div className="text-sm text-muted-foreground">{completionPercentage}% Complete</div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <CardTitle>Filters</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">EPIC</label>
              <Select value={epicFilter} onValueChange={setEpicFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All EPICs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All EPICs</SelectItem>
                  {uniqueEpics.map((epic) => (
                    <SelectItem key={epic} value={epic}>
                      {epic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Task Name</label>
              <Input
                placeholder="Search tasks..."
                value={taskNameFilter}
                onChange={(e) => setTaskNameFilter(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={completedFilter} onValueChange={setCompletedFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Tasks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="incomplete">Incomplete</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
          <CardDescription>
            {tasks.filter((t) => t.completed).length} of {tasks.length} tasks completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-muted rounded-full h-4">
            <div
              className="bg-gti-dark-green h-4 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {Object.entries(groupedTasks).map(([phase, phaseTasks]) => {
        const phaseCompleted = phaseTasks.filter((t) => t.completed).length
        const phaseTotal = phaseTasks.length
        const phaseStoryPoints = phaseTasks.reduce((sum, t) => sum + t.storyPoints, 0)
        const phaseCompletedPoints = phaseTasks.filter((t) => t.completed).reduce((sum, t) => sum + t.storyPoints, 0)

        return (
          <Card key={phase}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{phase}</CardTitle>
                  <CardDescription>
                    {phaseCompleted} / {phaseTotal} tasks • {phaseCompletedPoints} / {phaseStoryPoints} story points
                  </CardDescription>
                </div>
                <Badge
                  variant={phaseCompleted === phaseTotal ? "default" : "secondary"}
                  className={phaseCompleted === phaseTotal ? "bg-gti-dark-green hover:bg-gti-dark-green/90" : ""}
                >
                  {phaseCompleted === phaseTotal ? "Complete" : "In Progress"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {phaseTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-4 p-3 rounded-lg border transition-colors ${
                      task.completed ? "bg-green-50/50 border-green-200" : "hover:bg-accent/50"
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {task.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-gti-green" />
                      ) : (
                        <div className="h-5 w-5 rounded border-2 border-gray-300" />
                      )}
                    </div>

                    <div className="flex-shrink-0 w-24">
                      <Badge variant="outline" className="font-mono text-xs">
                        {task.planId}
                      </Badge>
                    </div>

                    <div className="flex-shrink-0 w-48">
                      <Badge variant="secondary" className="text-xs">
                        {task.epic}
                      </Badge>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                        {task.name}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Story Points</div>
                        <div className="font-semibold">{task.storyPoints}</div>
                      </div>

                      <div className="text-center min-w-[80px]">
                        <div className="text-xs text-muted-foreground">Duration</div>
                        <div className="text-sm">{task.estimateDuration}</div>
                      </div>

                      <div className="text-center min-w-[100px]">
                        <div className="text-xs text-muted-foreground">Due Date</div>
                        <div className="text-sm flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {task.dueDate}
                        </div>
                      </div>

                      <div className="text-center min-w-[120px]">
                        <div className="text-xs text-muted-foreground">Completed</div>
                        <div className="text-sm">
                          {task.completedDate ? (
                            <span className="text-gti-green font-medium">{task.completedDate}</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
