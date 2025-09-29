"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchBoxProps {
  placeholder?: string
  onSearch?: (query: string) => void
  onClear?: () => void
  className?: string
  defaultValue?: string
}

export function SearchBox({
  placeholder = "Search...",
  onSearch,
  onClear,
  className,
  defaultValue = "",
}: SearchBoxProps) {
  const [query, setQuery] = useState(defaultValue)

  const handleSearch = () => {
    const safeQuery = (query || "").trim()
    onSearch?.(safeQuery)
  }

  const handleClear = () => {
    setQuery("")
    onClear?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-9 pr-9"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      <Button onClick={handleSearch} size="sm">
        Search
      </Button>
    </div>
  )
}
