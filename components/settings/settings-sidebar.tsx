"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const iconMap: Record<string, string> = {
  DollarSign: "💰",
  Percent: "📊",
  Clock: "⏰",
  MapPin: "📍",
  Bell: "🔔",
  TestTube: "🧪",
  CheckSquare: "✅",
  Plug: "🔌",
  BarChart3: "📈",
  Users: "👥",
  Shield: "🛡️",
  Zap: "⚡",
  Building: "🏢",
  Bot: "🤖",
  HardDrive: "💾",
  FileCode: "📄", // Added FileCode icon for documentation
  ClipboardList: "📋", // Added icons for Task Plan and Test Validation
  TestTube2: "🧪",
}

interface NavigationGroup {
  id: string
  label: string
  icon: string
  items: Array<{
    id: string
    label: string
    icon: string
    description?: string
  }>
  defaultExpanded?: boolean
}

interface SettingsSidebarProps {
  navigationGroups: NavigationGroup[]
  activeSection: string
  onSectionChange: (section: string) => void
}

export function SettingsSidebar({ navigationGroups, activeSection, onSectionChange }: SettingsSidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(
    navigationGroups.filter((group) => group.defaultExpanded).map((group) => group.id),
  )

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]))
  }

  const getActiveGroup = () => {
    return navigationGroups.find((group) => group.items.some((item) => item.id === activeSection))?.id
  }

  return (
    <div className="w-64 border-r bg-card">
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-4">Settings</h3>
        <div className="space-y-2">
          {navigationGroups.map((group) => {
            const isExpanded = expandedGroups.includes(group.id)
            const isActiveGroup = getActiveGroup() === group.id

            return (
              <div key={group.id}>
                <Button
                  variant="ghost"
                  onClick={() => toggleGroup(group.id)}
                  className={cn("w-full justify-between p-2 h-auto", isActiveGroup && "bg-gti-light-green/10")}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{iconMap[group.icon] || "⚙️"}</span>
                    <span className="text-sm font-medium">{group.label}</span>
                  </div>
                  <span className="text-xs">{isExpanded ? "▼" : "▶"}</span>
                </Button>

                {isExpanded && (
                  <div className="ml-4 mt-1 space-y-1">
                    {group.items.map((item) => (
                      <Button
                        key={item.id}
                        variant="ghost"
                        onClick={() => onSectionChange(item.id)}
                        className={cn(
                          "w-full justify-start p-2 h-auto text-sm",
                          activeSection === item.id && "bg-gti-bright-green/10 text-gti-dark-green",
                        )}
                      >
                        <span className="text-xs mr-2">{iconMap[item.icon] || "•"}</span>
                        {item.label}
                      </Button>
                    ))}
                  </div>
                )}

                {group !== navigationGroups[navigationGroups.length - 1] && <Separator className="my-2" />}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
