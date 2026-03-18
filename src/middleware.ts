import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Admin routes - require SUPER_ADMIN, ADMIN, or MANAGER role
    if (path.startsWith("/admin")) {
      const role = token?.role as string
      if (!role || !["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(role)) {
        return NextResponse.redirect(new URL("/auth/signin", req.url))
      }
    }

    // Portal routes - require CLIENT role
    if (path.startsWith("/portal")) {
      const role = token?.role as string
      if (!role || role !== "CLIENT") {
        return NextResponse.redirect(new URL("/auth/signin", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*"],
}
