"use client"

export default function MinimalTestPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>Minimal Test Page</h1>
      <p style={{ marginBottom: "1rem" }}>This page uses no imports except React defaults.</p>
      <div
        style={{
          padding: "1rem",
          backgroundColor: "#f3f4f6",
          borderRadius: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <p>✅ Next.js routing works</p>
        <p>✅ React rendering works</p>
        <p>✅ Basic styling works</p>
      </div>
      <button
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "0.25rem",
          cursor: "pointer",
        }}
        onClick={() => alert("Button works!")}
      >
        Test Button
      </button>
    </div>
  )
}
