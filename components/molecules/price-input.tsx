"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface PriceInputProps {
  label?: string
  value?: number
  onChange?: (value: number) => void
  placeholder?: string
  min?: number
  max?: number
  step?: number
  required?: boolean
  error?: string
  className?: string
  id?: string
}

export function PriceInput({
  label,
  value,
  onChange,
  placeholder = "0.00",
  min = 0,
  max,
  step = 0.01,
  required = false,
  error,
  className,
  id,
}: PriceInputProps) {
  const [inputValue, setInputValue] = useState(value?.toString() || "")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)

    const numericValue = Number.parseFloat(newValue)
    if (!isNaN(numericValue) && numericValue >= min && (!max || numericValue <= max)) {
      onChange?.(numericValue)
    } else if (newValue === "") {
      onChange?.(0)
    }
  }

  const hasError = Boolean(error?.trim())

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
        <Input
          id={id}
          type="number"
          value={inputValue}
          onChange={handleChange}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          required={required}
          className={cn("pl-7", hasError && "border-red-500")}
        />
      </div>
      {hasError && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
