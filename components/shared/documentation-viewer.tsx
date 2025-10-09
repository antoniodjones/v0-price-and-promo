"use client"

import { useEffect, useState } from "react"
import { BookOpenIcon, ExternalLinkIcon } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useDocumentation } from "@/lib/contexts/documentation-context"

export function DocumentationViewer() {
  const { isOpen, currentDoc, closeDocumentation } = useDocumentation()
  const [content, setContent] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!currentDoc || !isOpen) return

    const fetchDocumentation = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/documentation?path=${encodeURIComponent(currentDoc)}`)

        if (!response.ok) {
          throw new Error("Failed to load documentation")
        }

        const data = await response.json()
        setContent(data.content)
      } catch (err) {
        setError("Unable to load documentation. Please try again.")
        console.error("[v0] Documentation fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDocumentation()
  }, [currentDoc, isOpen])

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeDocumentation()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpenIcon className="size-5 text-primary" />
              <SheetTitle>User Guide</SheetTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(currentDoc || "#", "_blank")}
              className="gap-2"
            >
              <ExternalLinkIcon className="size-4" />
              Open in New Tab
            </Button>
          </div>
          <SheetDescription>Follow along with this guide while using the application</SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                <p className="text-sm text-muted-foreground">Loading documentation...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-2">
                <p className="text-sm text-destructive">{error}</p>
                <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            </div>
          )}

          {!loading && !error && content && (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <MarkdownContent content={content} />
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

// Simple markdown renderer component
function MarkdownContent({ content }: { content: string }) {
  // Convert markdown to HTML (basic implementation)
  const renderMarkdown = (md: string) => {
    let html = md

    // Headers
    html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>")
    html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>")
    html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>")

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

    // Italic
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>")

    // Links
    html = html.replace(/\[([^\]]+)\]$$([^)]+)$$/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')

    // Lists
    html = html.replace(/^- (.*$)/gim, "<li>$1</li>")
    html = html.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")

    // Numbered lists
    html = html.replace(/^\d+\. (.*$)/gim, "<li>$1</li>")

    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, "<pre><code>$2</code></pre>")

    // Inline code
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>")

    // Paragraphs
    html = html.replace(/\n\n/g, "</p><p>")
    html = "<p>" + html + "</p>"

    // Tables
    html = html.replace(/\|(.+)\|/g, (match) => {
      const cells = match.split("|").filter((cell) => cell.trim())
      return "<tr>" + cells.map((cell) => `<td>${cell.trim()}</td>`).join("") + "</tr>"
    })

    return html
  }

  return <div dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} className="space-y-4" />
}
