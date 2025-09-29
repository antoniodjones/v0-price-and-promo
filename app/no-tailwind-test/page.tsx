import Link from "next/link"

export default function NoTailwindTest() {
  return (
    <div style={{ minHeight: "100vh", padding: "20px" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>
        Pricing & Promotions Management Platform
      </h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>Testing without Tailwind CSS classes</p>
      <Link href="/price-tracking" style={{ color: "blue", textDecoration: "underline" }}>
        Go to Price Tracking
      </Link>
    </div>
  )
}
