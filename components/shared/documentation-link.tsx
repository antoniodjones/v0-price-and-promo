"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useDocumentation } from "@/lib/contexts/documentation-context"
import { documentationConfigService } from "@/lib/services/documentation-config"
import type { DocumentationLink as DocLinkType } from "@/lib/types/documentation"

interface DocumentationLinkProps {
  pageId: string
  className?: string
}

export function DocumentationLink({ pageId, className }: DocumentationLinkProps) {
  const [docLink, setDocLink] = useState<DocLinkType | null>(null)
  const [globalEnabled, setGlobalEnabled] = useState(true)
  const [loading, setLoading] = useState(true)
  const { openDocumentation } = useDocumentation()

  useEffect(() => {
    async function loadConfig() {
      try {
        const config = await documentationConfigService.getConfig()
        setGlobalEnabled(config.globalEnabled)
        const link = config.links.find((l) => l.pageId === pageId)
        setDocLink(link || null)
      } catch (error) {
        console.error("[v0] Error loading documentation config:", error)
      } finally {
        setLoading(false)
      }
    }

    loadConfig()
  }, [pageId])

  // Don't render if globally disabled, page disabled, or no link found
  if (loading || !globalEnabled || !docLink || !docLink.enabled) {
    return null
  }

  const handleClick = () => {
    openDocumentation(docLink.documentationUrl)
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClick}
            className={className}
            aria-label="View documentation"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">{docLink.pageName} User Guide</p>
          {docLink.description && <p className="text-xs text-muted-foreground mt-1">{docLink.description}</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
