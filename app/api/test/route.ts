export async function GET() {
  return Response.json({
    success: true,
    message: "API routes are working",
    timestamp: new Date().toISOString(),
  })
}
