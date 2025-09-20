interface CustomArrowProps {
  className?: string
  color?: string
}

export function CustomArrow({ className = "h-12 w-12", color = "#22c55e" }: CustomArrowProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M9 6L15 12L9 18V6Z" fill={color} />
    </svg>
  )
}
