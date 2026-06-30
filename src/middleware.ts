import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const isApi = req.nextUrl.pathname.startsWith("/api/");
    const isAuthRoute = req.nextUrl.pathname.startsWith("/api/auth/");

    // Handle API route protection
    if (isApi && !isAuthRoute) {
      const isPublicGet = req.method === "GET" && req.nextUrl.pathname !== "/api/applications";
      const isPublicPost = req.method === "POST" && ["/api/applications", "/api/contact"].includes(req.nextUrl.pathname);

      if (isPublicGet || isPublicPost) {
        return NextResponse.next();
      }

      // Any other API access requires authentication
      if (!req.nextauth.token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const isApi = req.nextUrl.pathname.startsWith("/api/");
        const isAuthRoute = req.nextUrl.pathname.startsWith("/api/auth/");
        
        // Let the middleware function above handle API route auth logic
        if (isApi && !isAuthRoute) return true;

        // Admin dashboard UI requires token
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return !!token;
        }

        return true;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
