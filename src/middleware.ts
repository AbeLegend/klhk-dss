import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_EXPIRED_AT, COOKIE_PERMISSIONS, COOKIE_SESSION_EXPIRED, COOKIE_TOKEN, decryptText, encryptText } from "./lib";

const LOGIN_URL = "/login";
const MAP_INTERAKTIF_URL = "/map-interaktif";

export async function middleware(request: NextRequest) {
  // Get token and expiration time
  const token = request.cookies.get("token")?.value;
  const tokenExpiredAt = request.cookies.get("token_expired_at")?.value;
  const { pathname, search } = request.nextUrl;
  const redirectTo = encodeURIComponent(pathname + search);

  const redirect = (url: string) => NextResponse.redirect(new URL(url, request.url));

  // Helper to check expiration time
  const isTokenExpired = (expiry: string | undefined) => {
    if (!expiry) return true;
    const dateExpired = decryptText(expiry)
    const expiryDate = new Date(dateExpired);
    return expiryDate <= new Date();
  };

  // No token and trying to access a protected route (except login)
  if (!token && pathname !== LOGIN_URL) {
    return redirect(`${LOGIN_URL}?redirectTo=${redirectTo}`);
  }

  // Token expired
  if (token && isTokenExpired(tokenExpiredAt)) {
    const response = redirect(`${LOGIN_URL}`);
    response.cookies.set(COOKIE_SESSION_EXPIRED, encryptText("true")); // Remove token
    response.cookies.delete(COOKIE_TOKEN); // Remove token
    response.cookies.delete(COOKIE_EXPIRED_AT); // Remove expiration time
    response.cookies.delete(COOKIE_PERMISSIONS); // Remove expiration time
    return response;
  }

  // No token and accessing login page, allow access
  if (!token && pathname === LOGIN_URL) {
    return NextResponse.next();
  }

  // Token present and trying to access login page, redirect to map or stored URL
  if (token && pathname === LOGIN_URL) {
    const redirectToAfterLogin = request.nextUrl.searchParams.get("redirectTo");
    return redirect(redirectToAfterLogin ? decodeURIComponent(redirectToAfterLogin) : MAP_INTERAKTIF_URL);
  }

  // Token present and accessing root URL "/", redirect to map
  if (token && pathname === "/") {
    return redirect(MAP_INTERAKTIF_URL);
  }

  // Token present and accessing other pages, allow access
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
