export default function TestPage() {
  console.log("[v0] Test page is rendering")

  return (
    <div style={{ padding: "20px", backgroundColor: "white", color: "black" }}>
      <h1 style={{ color: "black", fontSize: "24px", marginBottom: "16px" }}>Test Page</h1>
      <p style={{ color: "black", fontSize: "16px" }}>This is a minimal test page to check if the preview works.</p>
      <div style={{ marginTop: "20px", padding: "10px", border: "1px solid black" }}>
        <strong>Status:</strong> Preview is working!
      </div>
    </div>
  )
}
