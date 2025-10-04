"use client"

import type React from "react"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Bold, Italic, List, ListOrdered, Heading2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      console.log("[v0] RichTextEditor: Content updated")
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4",
      },
    },
  })

  if (!editor) {
    return null
  }

  const handleContainerEvent = (e: React.SyntheticEvent) => {
    console.log("[v0] RichTextEditor: Event captured:", e.type)
    e.stopPropagation()
    e.preventDefault()
  }

  return (
    <div
      className="border rounded-md"
      onClick={handleContainerEvent}
      onMouseDown={handleContainerEvent}
      onMouseUp={handleContainerEvent}
      onKeyDown={(e) => {
        console.log("[v0] RichTextEditor: Key pressed:", e.key)
        e.stopPropagation()
      }}
      onFocus={(e) => {
        console.log("[v0] RichTextEditor: Focused")
        e.stopPropagation()
      }}
      onBlur={(e) => {
        console.log("[v0] RichTextEditor: Blurred")
        e.stopPropagation()
      }}
    >
      {/* Toolbar */}
      <div className="border-b bg-muted/30 p-2 flex gap-1 flex-wrap">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            console.log("[v0] RichTextEditor: Bold clicked")
            editor.chain().focus().toggleBold().run()
          }}
          className={cn("h-8 w-8 p-0", editor.isActive("bold") && "bg-muted")}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            console.log("[v0] RichTextEditor: Italic clicked")
            editor.chain().focus().toggleItalic().run()
          }}
          className={cn("h-8 w-8 p-0", editor.isActive("italic") && "bg-muted")}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            console.log("[v0] RichTextEditor: Heading clicked")
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }}
          className={cn("h-8 w-8 p-0", editor.isActive("heading", { level: 2 }) && "bg-muted")}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            console.log("[v0] RichTextEditor: Bullet list clicked")
            editor.chain().focus().toggleBulletList().run()
          }}
          className={cn("h-8 w-8 p-0", editor.isActive("bulletList") && "bg-muted")}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            console.log("[v0] RichTextEditor: Ordered list clicked")
            editor.chain().focus().toggleOrderedList().run()
          }}
          className={cn("h-8 w-8 p-0", editor.isActive("orderedList") && "bg-muted")}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <div
        onClick={(e) => {
          console.log("[v0] RichTextEditor: Editor area clicked")
          e.stopPropagation()
        }}
        onMouseDown={(e) => {
          console.log("[v0] RichTextEditor: Editor area mouse down")
          e.stopPropagation()
        }}
        onMouseUp={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
