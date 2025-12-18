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

  // ✅ ВАЖНО: создаём response заранее
  const response = NextResponse.next();

  // 🔹 нет accessToken, но есть refreshToken → пробуем checkSession
  if (!accessToken && refreshToken) {
    try {
      const sessionResponse = await checkSession();

      // ✅ ПРОБРАСЫВАЕМ set-cookie
      const setCookieHeader = sessionResponse.headers["set-cookie"];
      if (setCookieHeader) {
        setCookieHeader.forEach((cookie) => {
          response.headers.append("set-cookie", cookie);
        });
      }

      if (sessionResponse.status === 200 && sessionResponse.data !== null) {
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

  return response;
}

export const config = {
  matcher: ["/notes/:path*", "/profile/:path*", "/sign-in", "/sign-up"],
};
