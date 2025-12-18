import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "@/lib/api/serverApi";

const PRIVATE_ROUTES = ["/notes", "/profile"];
const AUTH_ROUTES = ["/sign-in", "/sign-up"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const isPrivateRoute = PRIVATE_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  let isAuthenticated = Boolean(accessToken);

  // 🔹 нет accessToken, но есть refreshToken → пробуем checkSession
  if (!accessToken && refreshToken) {
    try {
      const response = await checkSession();

      if (response.status === 200 && response.data !== null) {
        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // 🔒 неавторизованный → private → sign-in
  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // 🔁 авторизованный → auth → /
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/notes/:path*", "/profile/:path*", "/sign-in", "/sign-up"],
};
