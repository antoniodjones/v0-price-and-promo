export default function DebugConsolePage() {
  console.log("[v0] Debug page is rendering")
  console.log("[v0] Current timestamp:", new Date().toISOString())
  console.log("[v0] Environment:", process.env.NODE_ENV)

  return (
    <div>
      <h1>Debug Console Page</h1>
      <p>Check the browser console for debug logs</p>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  )
}
