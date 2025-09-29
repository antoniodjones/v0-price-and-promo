"use client"

import { useState } from "react"

export default function TestReactPage() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>Testing React Import</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
