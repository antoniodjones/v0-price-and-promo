"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme/theme-provider"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon">
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  const isDark =
    theme === "dark" ||
    (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="transition-all duration-200 hover:bg-accent"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-yellow-500 transition-all duration-200" />
      ) : (
        <Moon className="h-4 w-4 text-slate-600 transition-all duration-200" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
