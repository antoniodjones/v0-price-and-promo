export default function SimpleHomePage() {
  console.log("[v0] SimpleHomePage rendering")

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">GTI Pricing Engine</h1>
      <p className="text-lg text-gray-600 mb-8">Testing basic functionality without complex imports</p>
      <div className="bg-blue-100 p-4 rounded-lg">
        <p className="text-blue-800">If you can see this, basic routing and Tailwind are working!</p>
      </div>
    </div>
  )
}
