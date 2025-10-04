"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface UserStory {
  id: string
  title: string
  description: string | null
  user_type: string | null
  goal: string | null
  reason: string | null
  status: string | null
  priority: string | null
  story_points: number | null
  assignee: string | null
  reporter: string | null
  epic: string | null
  acceptance_criteria: any | null
  tasks: any | null
  dependencies: any | null
  labels: any | null
  related_issues: any | null
  created_by: string | null
  updated_by: string | null
  created_at: string
  updated_at: string
}

export interface UserStoryFilters {
  type?: string
  status?: string
  priority?: string
  epic?: string
  search?: string
}

export async function getUserStories(filters?: UserStoryFilters): Promise<UserStory[]> {
  try {
    const supabase = await createClient()

    let query = supabase.from("user_stories").select("*").order("created_at", { ascending: false })

    // Apply filters
    if (filters?.status && filters.status !== "all") {
      query = query.eq("status", filters.status)
    }
    if (filters?.priority && filters.priority !== "all") {
      query = query.eq("priority", filters.priority)
    }
    if (filters?.epic && filters.epic !== "all") {
      query = query.eq("epic", filters.epic)
    }
    if (filters?.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,id.ilike.%${filters.search}%`,
      )
    }

    const { data, error } = await query

    if (error) {
      console.error("[v0] Error fetching user stories:", error)
      throw new Error(`Failed to fetch user stories: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error("[v0] Error in getUserStories:", error)
    throw error
  }
}

export async function toggleTaskCompletion(taskId: string): Promise<UserStory> {
  try {
    const supabase = await createClient()

    // First, get the current task
    const { data: currentTask, error: fetchError } = await supabase
      .from("user_stories")
      .select("*")
      .eq("id", taskId)
      .single()

    if (fetchError) {
      console.error("[v0] Error fetching task:", fetchError)
      throw new Error(`Failed to fetch task: ${fetchError.message}`)
    }

    // Toggle status
    const newStatus = currentTask.status === "Done" ? "To Do" : "Done"

    // Update the task
    const { data, error } = await supabase
      .from("user_stories")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating task:", error)
      throw new Error(`Failed to update task: ${error.message}`)
    }

    revalidatePath("/task-planning")
    return data
  } catch (error) {
    console.error("[v0] Error in toggleTaskCompletion:", error)
    throw error
  }
}

export async function createUserStory(story: Omit<UserStory, "created_at" | "updated_at">): Promise<UserStory> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("user_stories")
      .insert({
        ...story,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating user story:", error)
      throw new Error(`Failed to create user story: ${error.message}`)
    }

    revalidatePath("/task-planning")
    return data
  } catch (error) {
    console.error("[v0] Error in createUserStory:", error)
    throw error
  }
}

export async function updateUserStory(taskId: string, updates: Partial<UserStory>): Promise<UserStory> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("user_stories")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating user story:", error)
      throw new Error(`Failed to update user story: ${error.message}`)
    }

    revalidatePath("/task-planning")
    return data
  } catch (error) {
    console.error("[v0] Error in updateUserStory:", error)
    throw error
  }
}

export async function deleteUserStory(taskId: string): Promise<void> {
  try {
    const supabase = await createClient()

    const { error } = await supabase.from("user_stories").delete().eq("id", taskId)

    if (error) {
      console.error("[v0] Error deleting user story:", error)
      throw new Error(`Failed to delete user story: ${error.message}`)
    }

    revalidatePath("/task-planning")
  } catch (error) {
    console.error("[v0] Error in deleteUserStory:", error)
    throw error
  }
}

export async function getTaskStatistics() {
  try {
    const supabase = await createClient()

    const { data: allTasks, error } = await supabase.from("user_stories").select("*")

    if (error) {
      console.error("[v0] Error fetching tasks for statistics:", error)
      throw new Error(`Failed to fetch tasks: ${error.message}`)
    }

    const totalTasks = allTasks.length
    const completedTasks = allTasks.filter((t) => t.status === "Done").length
    const inProgressTasks = allTasks.filter((t) => t.status === "In Progress").length
    const todoTasks = allTasks.filter((t) => t.status === "To Do").length
    const totalStoryPoints = allTasks.reduce((sum, task) => sum + (task.story_points || 0), 0)
    const completedStoryPoints = allTasks
      .filter((t) => t.status === "Done")
      .reduce((sum, task) => sum + (task.story_points || 0), 0)
    const completionPercentage = totalStoryPoints > 0 ? Math.round((completedStoryPoints / totalStoryPoints) * 100) : 0

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      totalStoryPoints,
      completedStoryPoints,
      completionPercentage,
      statsByType: [], // Empty array since we don't have type field
    }
  } catch (error) {
    console.error("[v0] Error in getTaskStatistics:", error)
    throw error
  }
}
