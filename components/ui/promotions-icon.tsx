interface PromotionsIconProps {
  className?: string
  size?: number
}

export function PromotionsIcon({ className = "", size = 32 }: PromotionsIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle */}
      <circle cx="16" cy="16" r="16" className="fill-primary" />

      {/* Price tag shape */}
      <path
        d="M20.5 8H13.5L8 13.5L16 21.5L24 13.5L20.5 8Z"
        className="fill-primary-foreground"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Percentage symbol */}
      <circle cx="14" cy="12" r="1.5" className="fill-primary" />
      <circle cx="18" cy="17" r="1.5" className="fill-primary" />
      <line x1="13" y1="18" x2="19" y2="11" className="stroke-primary" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
