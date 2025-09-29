import type * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { LoadingSpinner } from "./loading-spinner"

const buttonVariants = {
  variant: {
    default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
    outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
    success: "bg-green-600 text-white shadow hover:bg-green-700",
    primary: "bg-blue-600 text-white shadow hover:bg-blue-700",
  },
  size: {
    default: "h-9 px-4 py-2 has-[>svg]:px-3",
    sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
    lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
    icon: "size-9",
  },
}

const baseButtonClasses =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"

interface EnhancedButtonProps extends React.ComponentProps<"button"> {
  variant?: keyof typeof buttonVariants.variant
  size?: keyof typeof buttonVariants.size
  asChild?: boolean
  loading?: boolean
  loadingText?: string
}

function EnhancedButton({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  loading = false,
  loadingText,
  children,
  disabled,
  ...props
}: EnhancedButtonProps) {
  const Comp = asChild ? Slot : "button"

  const variantClasses = buttonVariants.variant[variant]
  const sizeClasses = buttonVariants.size[size]
  const combinedClasses = cn(baseButtonClasses, variantClasses, sizeClasses, className)

  return (
    <Comp data-slot="button" className={combinedClasses} disabled={disabled || loading} {...props}>
      {loading ? (
        <>
          <LoadingSpinner size="sm" />
          {loadingText || children}
        </>
      ) : (
        children
      )}
    </Comp>
  )
}

export { EnhancedButton, buttonVariants }
