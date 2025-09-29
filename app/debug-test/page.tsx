export default function DebugTestPage() {
  console.log("[v0] DebugTestPage component is rendering")

  return (
    <div>
      <h1>Debug Test Page</h1>
      <p>If you can see this, React is working</p>
      <script
        dangerouslySetInnerHTML={{
          __html: `
          console.log("[v0] Debug test page HTML loaded");
          document.addEventListener('DOMContentLoaded', function() {
            console.log("[v0] DOM content loaded");
          });
        `,
        }}
      />
    </div>
  )
}
