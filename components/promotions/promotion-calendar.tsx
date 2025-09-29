"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronLeft, ChevronRight, Plus, Filter } from "lucide-react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns"

interface PromotionEvent {
  id: string
  name: string
  type: "customer_discount" | "inventory_discount" | "bogo" | "bundle"
  startDate: Date
  endDate: Date
  status: "active" | "scheduled" | "expired"
  value: string
  description: string
}

const mockPromotions: PromotionEvent[] = [
  {
    id: "1",
    name: "Holiday BOGO",
    type: "bogo",
    startDate: new Date(2025, 0, 15),
    endDate: new Date(2025, 0, 31),
    status: "scheduled",
    value: "50% off 2nd item",
    description: "Buy one get one 50% off all flower products",
  },
  {
    id: "2",
    name: "Premium Brand Discount",
    type: "customer_discount",
    startDate: new Date(2025, 0, 1),
    endDate: new Date(2025, 0, 28),
    status: "active",
    value: "15% off",
    description: "15% off all premium brand products for A-tier customers",
  },
  {
    id: "3",
    name: "Expiration Auto Discount",
    type: "inventory_discount",
    startDate: new Date(2025, 0, 1),
    endDate: new Date(2025, 11, 31),
    status: "active",
    value: "20% off",
    description: "Automatic 20% discount on products expiring within 30 days",
  },
]

export function PromotionCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [promotions, setPromotions] = useState<PromotionEvent[]>(mockPromotions)
  const [filteredPromotions, setFilteredPromotions] = useState<PromotionEvent[]>(mockPromotions)
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getPromotionsForDate = (date: Date) => {
    return filteredPromotions.filter((promo) => date >= promo.startDate && date <= promo.endDate)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "customer_discount":
        return "bg-gti-bright-green text-white"
      case "inventory_discount":
        return "bg-orange-500 text-white"
      case "bogo":
        return "bg-blue-500 text-white"
      case "bundle":
        return "bg-purple-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "customer_discount":
        return "Customer"
      case "inventory_discount":
        return "Inventory"
      case "bogo":
        return "BOGO"
      case "bundle":
        return "Bundle"
      default:
        return "Unknown"
    }
  }

  const handleTypeFilter = (type: string) => {
    const newSelectedTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type]

    setSelectedTypes(newSelectedTypes)

    if (newSelectedTypes.length === 0) {
      setFilteredPromotions(promotions)
    } else {
      setFilteredPromotions(promotions.filter((p) => newSelectedTypes.includes(p.type)))
    }
  }

  const selectedDatePromotions = selectedDate ? getPromotionsForDate(selectedDate) : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gti-dark-green">Promotion Calendar</h2>
          <p className="text-muted-foreground">View and manage promotional campaigns across time</p>
        </div>
        <Button className="bg-gti-bright-green hover:bg-gti-medium-green">
          <Plus className="mr-2 h-4 w-4" />
          Schedule Promotion
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <CardTitle className="text-xl">{format(currentDate, "MMMM yyyy")}</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Today
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day) => {
                  const dayPromotions = getPromotionsForDate(day)
                  const isSelected = selectedDate && isSameDay(day, selectedDate)
                  const isToday = isSameDay(day, new Date())

                  return (
                    <div
                      key={day.toISOString()}
                      className={`
                        min-h-[80px] p-1 border rounded cursor-pointer transition-colors
                        ${isSelected ? "bg-gti-bright-green/10 border-gti-bright-green" : "hover:bg-muted/50"}
                        ${isToday ? "border-gti-bright-green border-2" : "border-border"}
                      `}
                      onClick={() => setSelectedDate(day)}
                    >
                      <div
                        className={`text-sm font-medium mb-1 ${
                          isSameMonth(day, currentDate) ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {format(day, "d")}
                      </div>

                      <div className="space-y-1">
                        {dayPromotions.slice(0, 2).map((promo) => (
                          <div
                            key={promo.id}
                            className={`text-xs px-1 py-0.5 rounded truncate ${getTypeColor(promo.type)}`}
                            title={promo.name}
                          >
                            {promo.name}
                          </div>
                        ))}
                        {dayPromotions.length > 2 && (
                          <div className="text-xs text-muted-foreground">+{dayPromotions.length - 2} more</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter by Type
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { type: "customer_discount", label: "Customer Discounts" },
                { type: "inventory_discount", label: "Inventory Discounts" },
                { type: "bogo", label: "BOGO Promotions" },
                { type: "bundle", label: "Bundle Deals" },
              ].map(({ type, label }) => (
                <div key={type} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={type}
                    checked={selectedTypes.includes(type) || selectedTypes.length === 0}
                    onChange={() => handleTypeFilter(type)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor={type} className="text-sm flex items-center gap-2">
                    <div className={`w-3 h-3 rounded ${getTypeColor(type)}`} />
                    {label}
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Selected Date Details */}
          {selectedDate && (
            <Card>
              <CardHeader>
                <CardTitle>{format(selectedDate, "MMMM d, yyyy")}</CardTitle>
                <CardDescription>{selectedDatePromotions.length} promotion(s) active</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedDatePromotions.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No promotions scheduled for this date</p>
                ) : (
                  selectedDatePromotions.map((promo) => (
                    <div key={promo.id} className="border rounded p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{promo.name}</h4>
                        <Badge className={getTypeColor(promo.type)}>{getTypeLabel(promo.type)}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{promo.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{promo.value}</span>
                        <span>
                          {format(promo.startDate, "MMM d")} - {format(promo.endDate, "MMM d")}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>This Month</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Active Promotions</span>
                <span className="font-medium">{promotions.filter((p) => p.status === "active").length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Scheduled</span>
                <span className="font-medium">{promotions.filter((p) => p.status === "scheduled").length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Expiring Soon</span>
                <span className="font-medium text-orange-600">
                  {
                    promotions.filter((p) => {
                      const daysUntilEnd = Math.ceil(
                        (p.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                      )
                      return daysUntilEnd <= 7 && daysUntilEnd > 0
                    }).length
                  }
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
