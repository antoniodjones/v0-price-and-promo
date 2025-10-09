"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface DocumentationContextType {
  isOpen: boolean
  currentDoc: string | null
  openDocumentation: (docPath: string) => void
  closeDocumentation: () => void
}

const DocumentationContext = createContext<DocumentationContextType | undefined>(undefined)

export function DocumentationProvider({
  children,
}: {
  children: React.Node
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentDoc, setCurrentDoc] = useState<string | null>(null)

  const openDocumentation = (docPath: string) => {
    setCurrentDoc(docPath)
    setIsOpen(true)
  }

  const closeDocumentation = () => {
    setIsOpen(false)
    // Keep currentDoc so it doesn't flash when closing
  }

  return (
    <DocumentationContext.Provider value={{ isOpen, currentDoc, openDocumentation, closeDocumentation }}>
      {children}
    </DocumentationContext.Provider>
  )
}

export function useDocumentation() {
  const context = useContext(DocumentationContext)
  if (!context) {
    throw new Error("useDocumentation must be used within DocumentationProvider")
  }
  return context
}
