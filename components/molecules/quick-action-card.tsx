import { Button } from "@/components/ui/button"
import { CustomArrow } from "@/components/ui/custom-arrow"
import type { LucideIcon } from "lucide-react"
import Link from "next/link"

interface QuickActionCardProps {
  title: string
  description: string
  href: string
  icon: LucideIcon
  color: string
}

export function QuickActionCard({ title, description, href, icon: Icon, color }: QuickActionCardProps) {
  return (
    <Link href={href}>
      <Button variant="outline" className="w-full justify-start h-auto p-4 hover:bg-gray-50 bg-transparent">
        <div className="flex items-center space-x-3 w-full">
          <div className={`p-2 rounded-md ${color} flex-shrink-0`}>
            <Icon className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="font-medium text-foreground">{title}</div>
            <div className="text-sm text-muted-foreground">{description}</div>
          </div>
          <div className="flex-shrink-0 ml-2">
            <CustomArrow className="h-6 w-6" color="#6b7280" />
          </div>
        </div>
      </Button>
    </Link>
  )
}
