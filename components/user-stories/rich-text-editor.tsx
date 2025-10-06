"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Bold, Italic, List, ListOrdered, Heading2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import React from "react"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  disabled?: boolean // Added disabled prop
}

export function RichTextEditor({ content, onChange, placeholder, disabled = false }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      console.log("[v0] RichTextEditor: Content updated")
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4",
          disabled && "opacity-50 cursor-not-allowed",
        ),
      },
    },
  })

  React.useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled)
    }
  }, [editor, disabled])

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
      className={cn("border rounded-md", disabled && "bg-muted/30")} // Add disabled styling
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
          disabled={disabled} // Disable button when editor is disabled
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
          disabled={disabled} // Disable button when editor is disabled
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
          disabled={disabled} // Disable button when editor is disabled
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
          disabled={disabled} // Disable button when editor is disabled
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
          disabled={disabled} // Disable button when editor is disabled
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
