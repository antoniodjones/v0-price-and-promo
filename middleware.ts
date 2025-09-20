import { type NextRequest, NextResponse } from "next/server"
import { apiRateLimiter, pricingRateLimiter } from "./lib/rate-limiter"
import { logHttp, logWarn } from "./lib/logger"

export async function middleware(request: NextRequest) {
  const start = Date.now()
  const { pathname } = request.nextUrl

  // Skip middleware for static files and internal Next.js routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/_") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next()
  }

  // Apply rate limiting to API routes
  if (pathname.startsWith("/api/")) {
    let rateLimiter = apiRateLimiter

    // Use specific rate limiter for pricing endpoints
    if (pathname.includes("/pricing/")) {
      rateLimiter = pricingRateLimiter
    }

    const { allowed, remaining, resetTime } = await rateLimiter.isAllowed(request)

    if (!allowed) {
      logWarn(`Rate limit exceeded for ${pathname}`, {
        ip: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent"),
      })

      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded",
          message: "Too many requests. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": rateLimiter["config"].maxRequests.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": resetTime.toString(),
            "Retry-After": Math.ceil((resetTime - Date.now()) / 1000).toString(),
          },
        },
      )
    }

    // Add rate limit headers to successful responses
    const response = NextResponse.next()
    response.headers.set("X-RateLimit-Limit", rateLimiter["config"].maxRequests.toString())
    response.headers.set("X-RateLimit-Remaining", remaining.toString())
    response.headers.set("X-RateLimit-Reset", resetTime.toString())

    // Log API requests
    const duration = Date.now() - start
    logHttp(`${request.method} ${pathname}`, {
      duration,
      ip: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent"),
      remaining,
    })

    return response
  }

  // Add security headers for all requests
  const response = NextResponse.next()

  // Security headers
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("X-XSS-Protection", "1; mode=block")

  // CSP header for production
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
    )
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
