"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Edit,
  Save,
  Plus,
  Trash2,
  Bot,
  Clock,
  User,
  ExternalLink,
  RefreshCw,
  BookOpen,
  Code,
} from "lucide-react"
import Link from "next/link"

interface DocumentationPage {
  id: string
  title: string
  slug: string
  type: "user" | "technical" | "api"
  lastModified: string
  modifiedBy: string
  status: "published" | "draft"
  content: string
}

interface AIAgent {
  id: string
  name: string
  description: string
  status: "active" | "inactive"
  lastRun: string
}

export default function DocumentationSettings() {
  const [selectedDoc, setSelectedDoc] = useState<DocumentationPage | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState("")

  const [documentationPages] = useState<DocumentationPage[]>([
    {
      id: "1",
      title: "User Documentation",
      slug: "user-docs",
      type: "user",
      lastModified: "2025-10-01",
      modifiedBy: "System",
      status: "published",
      content: "Comprehensive user guide for tier management...",
    },
    {
      id: "2",
      title: "Technical Documentation",
      slug: "tech-docs",
      type: "technical",
      lastModified: "2025-10-01",
      modifiedBy: "System",
      status: "published",
      content: "Technical documentation for pricing engine...",
    },
    {
      id: "3",
      title: "API Documentation",
      slug: "api-docs",
      type: "api",
      lastModified: "2025-09-15",
      modifiedBy: "Admin",
      status: "published",
      content: "API reference documentation...",
    },
  ])

  const [aiAgents] = useState<AIAgent[]>([
    {
      id: "1",
      name: "Documentation Updater",
      description: "Automatically updates documentation based on code changes",
      status: "active",
      lastRun: "2025-10-01 10:30 AM",
    },
    {
      id: "2",
      name: "API Doc Generator",
      description: "Generates API documentation from code annotations",
      status: "active",
      lastRun: "2025-10-01 09:15 AM",
    },
    {
      id: "3",
      name: "Change Log Writer",
      description: "Creates change logs from git commits",
      status: "inactive",
      lastRun: "2025-09-28 03:45 PM",
    },
  ])

  const handleEdit = (doc: DocumentationPage) => {
    setSelectedDoc(doc)
    setEditContent(doc.content)
    setIsEditing(true)
  }

  const handleSave = () => {
    // Save logic here
    setIsEditing(false)
    setSelectedDoc(null)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "user":
        return <BookOpen className="h-4 w-4" />
      case "technical":
        return <Code className="h-4 w-4" />
      case "api":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getTypeBadge = (type: string) => {
    const colors = {
      user: "bg-blue-500/10 text-blue-500",
      technical: "bg-purple-500/10 text-purple-500",
      api: "bg-green-500/10 text-green-500",
    }
    return colors[type as keyof typeof colors] || "bg-gray-500/10 text-gray-500"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Documentation Management</CardTitle>
          <CardDescription>Manage system documentation with wiki-style editing and AI agent automation</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pages" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pages">Documentation Pages</TabsTrigger>
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="ai-agents">AI Agents</TabsTrigger>
            </TabsList>

            {/* Documentation Pages Tab */}
            <TabsContent value="pages" className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{documentationPages.length} documentation page(s)</p>
                <Button size="sm" className="bg-gti-dark-green hover:bg-gti-medium-green">
                  <Plus className="mr-2 h-4 w-4" />
                  New Page
                </Button>
              </div>

              <div className="space-y-2">
                {documentationPages.map((doc) => (
                  <Card key={doc.id} className="hover:bg-accent/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="mt-1">{getTypeIcon(doc.type)}</div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold">{doc.title}</h4>
                              <Badge variant="outline" className={getTypeBadge(doc.type)}>
                                {doc.type}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={
                                  doc.status === "published"
                                    ? "bg-green-500/10 text-green-500"
                                    : "bg-yellow-500/10 text-yellow-500"
                                }
                              >
                                {doc.status}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>Modified {doc.lastModified}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <User className="h-3 w-3" />
                                <span>by {doc.modifiedBy}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Link href={`/${doc.slug}`} target="_blank">
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(doc)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Editor Tab */}
            <TabsContent value="editor" className="space-y-4">
              {isEditing && selectedDoc ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{selectedDoc.title}</h3>
                      <p className="text-sm text-muted-foreground">Edit documentation content</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSave} className="bg-gti-dark-green hover:bg-gti-medium-green">
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="doc-title">Title</Label>
                      <Input id="doc-title" defaultValue={selectedDoc.title} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="doc-slug">Slug</Label>
                      <Input id="doc-slug" defaultValue={selectedDoc.slug} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="doc-content">Content</Label>
                      <Textarea
                        id="doc-content"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="min-h-[400px] font-mono text-sm"
                        placeholder="Write your documentation content here..."
                      />
                      <p className="text-xs text-muted-foreground">
                        Supports Markdown formatting. Use AI agents to automatically update content.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Document Selected</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select a document from the "Documentation Pages" tab to edit
                  </p>
                  <Button variant="outline" onClick={() => {}}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Document
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* AI Agents Tab */}
            <TabsContent value="ai-agents" className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{aiAgents.length} AI agent(s) configured</p>
                <Button size="sm" className="bg-gti-dark-green hover:bg-gti-medium-green">
                  <Plus className="mr-2 h-4 w-4" />
                  Deploy New Agent
                </Button>
              </div>

              <div className="space-y-2">
                {aiAgents.map((agent) => (
                  <Card key={agent.id} className="hover:bg-accent/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <Bot className="h-5 w-5 mt-1 text-gti-dark-green" />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold">{agent.name}</h4>
                              <Badge
                                variant="outline"
                                className={
                                  agent.status === "active"
                                    ? "bg-green-500/10 text-green-500"
                                    : "bg-gray-500/10 text-gray-500"
                                }
                              >
                                {agent.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{agent.description}</p>
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>Last run: {agent.lastRun}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-accent/20">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Bot className="h-5 w-5 mt-1 text-gti-dark-green" />
                    <div className="space-y-1">
                      <h4 className="font-semibold">About AI Agents</h4>
                      <p className="text-sm text-muted-foreground">
                        AI agents can automatically update documentation based on code changes, generate API docs from
                        annotations, create change logs, and more. Deploy agents to automate documentation maintenance
                        and keep your docs always up-to-date.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Version History */}
      <Card>
        <CardHeader>
          <CardTitle>Version History</CardTitle>
          <CardDescription>Track changes and restore previous versions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Version 1.2.0</p>
                  <p className="text-xs text-muted-foreground">2025-10-01 10:30 AM by System</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Restore
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Version 1.1.0</p>
                  <p className="text-xs text-muted-foreground">2025-09-28 03:45 PM by Admin</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Restore
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
