"use client"

import { useState } from "react"

export default function DebugPhase1Page() {
  console.log("[v0] Debug page loading...")

  const [step, setStep] = useState(1)

  console.log("[v0] Current step:", step)

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Phase 1 Debug Test</h1>
        <p className="text-muted-foreground">Step-by-step component testing</p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <button onClick={() => setStep(1)} className="px-4 py-2 bg-blue-500 text-white rounded">
            Test Basic UI
          </button>
          <button onClick={() => setStep(2)} className="px-4 py-2 bg-green-500 text-white rounded">
            Test Atoms
          </button>
          <button onClick={() => setStep(3)} className="px-4 py-2 bg-purple-500 text-white rounded">
            Test Molecules
          </button>
        </div>

        {step === 1 && (
          <div className="p-4 border rounded">
            <h2 className="text-xl font-bold">Step 1: Basic UI Test</h2>
            <p>If you can see this, basic React rendering works.</p>
            <p>Current time: {new Date().toLocaleTimeString()}</p>
          </div>
        )}

        {step === 2 && <TestAtoms />}

        {step === 3 && <TestMolecules />}
      </div>
    </div>
  )
}

function TestAtoms() {
  console.log("[v0] Testing atoms...")

  try {
    // Import atoms one by one to isolate issues
    const { PriceDisplay, DiscountBadge } = require("@/components/atoms")
    console.log("[v0] Atoms imported successfully")

    return (
      <div className="p-4 border rounded">
        <h2 className="text-xl font-bold">Step 2: Atoms Test</h2>
        <div className="space-y-4">
          <div>
            <p>Price Display:</p>
            <PriceDisplay price={29.99} size="lg" />
          </div>
          <div>
            <p>Discount Badge:</p>
            <DiscountBadge percentage={20} />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("[v0] Atoms import error:", error)
    return (
      <div className="p-4 border rounded bg-red-50">
        <h2 className="text-xl font-bold text-red-600">Atoms Import Error</h2>
        <pre className="text-sm">{String(error)}</pre>
      </div>
    )
  }
}

function TestMolecules() {
  console.log("[v0] Testing molecules...")

  try {
    const { SearchBox, ActionButtons } = require("@/components/molecules")
    console.log("[v0] Basic molecules imported successfully")

    return (
      <div className="p-4 border rounded">
        <h2 className="text-xl font-bold">Step 3: Molecules Test</h2>
        <div className="space-y-4">
          <SearchBox
            placeholder="Test search..."
            onSearch={(query) => console.log("[v0] Search:", query)}
            onClear={() => console.log("[v0] Search cleared")}
          />
          <ActionButtons
            onSave={() => console.log("[v0] Save clicked")}
            onCancel={() => console.log("[v0] Cancel clicked")}
          />
        </div>
      </div>
    )
  } catch (error) {
    console.error("[v0] Molecules import error:", error)
    return (
      <div className="p-4 border rounded bg-red-50">
        <h2 className="text-xl font-bold text-red-600">Molecules Import Error</h2>
        <pre className="text-sm">{String(error)}</pre>
      </div>
    )
  }
}
