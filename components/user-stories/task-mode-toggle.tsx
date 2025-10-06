"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface TaskModeToggleProps {
  mode: "agent" | "user"
  onModeChange: (mode: "agent" | "user") => void
  disabled?: boolean
}

export function TaskModeToggle({ mode, onModeChange, disabled }: TaskModeToggleProps) {
  const isUserMode = mode === "user"

  return (
    <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/30">
      <div className="flex items-center gap-2">
        <Label
          htmlFor="mode-toggle"
          className={`text-sm font-medium transition-colors ${
            !isUserMode ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"
          }`}
        >
          Agent
        </Label>
        <Switch
          id="mode-toggle"
          checked={isUserMode}
          onCheckedChange={(checked) => onModeChange(checked ? "user" : "agent")}
          disabled={disabled}
          className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-blue-600"
        />
        <Label
          htmlFor="mode-toggle"
          className={`text-sm font-medium transition-colors ${
            isUserMode ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
          }`}
        >
          User
        </Label>
      </div>
      <div className="flex-1 text-xs text-muted-foreground">
        {isUserMode ? (
          <span>User can modify task and invoke actions (override by user)</span>
        ) : (
          <span>Agent has control (auto-commit enabled by default)</span>
        )}
      </div>
    </div>
  )
}
