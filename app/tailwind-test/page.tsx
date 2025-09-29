export default function TailwindTestPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Tailwind CSS Test</h1>
      <p className="text-gray-600 mb-4">Testing if Tailwind CSS classes work properly.</p>
      <div className="bg-blue-100 p-4 rounded-lg mb-4">
        <p className="text-blue-800">✅ Tailwind background colors work</p>
        <p className="text-blue-800">✅ Tailwind padding and margins work</p>
        <p className="text-blue-800">✅ Tailwind border radius works</p>
      </div>
      <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Tailwind Button</button>
    </div>
  )
}
