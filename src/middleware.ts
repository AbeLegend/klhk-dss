import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LOGIN_URL = '/login';
const DASHBOARD_URL = '/dashboard';

export async function middleware(request: NextRequest) {
  // Get Token
  const token = request.cookies.get('token')?.value;
  const { pathname, search } = request.nextUrl;
  const redirectTo = encodeURIComponent(pathname + search);

  const redirect = (url: string) =>
    NextResponse.redirect(new URL(url, request.url));

  // No token and trying to access a protected route (except login)
  if (!token && pathname !== LOGIN_URL) {
    console.log("!TOKEN");
    return redirect(`${LOGIN_URL}?redirectTo=${redirectTo}`);
  }

  // No token and accessing login page, allow access
  if (!token && pathname === LOGIN_URL) {
    return NextResponse.next();
  }

  // Token present and trying to access login page, redirect to the stored redirectTo URL or dashboard
  if (token && pathname === LOGIN_URL) {
    const redirectToAfterLogin = request.nextUrl.searchParams.get('redirectTo');
    if (redirectToAfterLogin) {
      return redirect(decodeURIComponent(redirectToAfterLogin));
    } else {
      return redirect(DASHBOARD_URL);
    }
  }

  // Token present and trying to access root URL "/", redirect to dashboard
  if (token && pathname === '/') {
    return redirect(DASHBOARD_URL);
  }

  // Token present and accessing any other page, allow access
  if (token) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
