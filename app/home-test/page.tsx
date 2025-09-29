import Link from "next/link"

export default function HomeTest() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-4">
        <h1 className="text-4xl font-bold mb-6">
          <span className="text-green-600">Pricing & Promotions</span>
          <br />
          Management Platform
        </h1>
        <p className="text-xl text-muted-foreground mb-8">Testing simplified version without complex imports</p>
        <Link href="/price-tracking" className="text-blue-600 hover:underline">
          Go to Price Tracking
        </Link>
      </div>
    </div>
  )
}
