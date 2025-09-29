import { PromotionsDashboard } from "@/components/promotions/promotions-dashboard"

export default function PromotionsDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div>
            <h1 className="text-2xl font-bold text-primary mb-2">Pricing & Promotions</h1>
            <h2 className="text-3xl font-bold text-black">Promotions Dashboard</h2>
            <p className="text-muted-foreground mt-1">
              Monitor and manage all promotional campaigns from one central hub
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <PromotionsDashboard />
      </main>
    </div>
  )
}
