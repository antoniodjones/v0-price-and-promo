export default function TailwindBasicPage() {
  console.log("[v0] TailwindBasicPage rendering")

  return (
    <div className="min-h-screen bg-blue-500 p-8">
      <h1 className="text-4xl font-bold text-white mb-4">Tailwind Test</h1>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <p className="text-gray-800">If you can see this styled content, Tailwind is working!</p>
      </div>
    </div>
  )
}
