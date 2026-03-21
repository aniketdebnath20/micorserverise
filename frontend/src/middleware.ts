import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = ["/login", "/signup", "/verify-otp"];

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  /* If user is NOT logged in and tries protected route */
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/signup", request.url));
  }

  /* If logged-in user tries auth pages */
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  /* If logged-in user visits root "/" */
  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",                // protect root
    // "/chat/:path*",
    "/profile/:path*",
    "/login",
    "/signup",
    "/verify-otp",
  ],
};