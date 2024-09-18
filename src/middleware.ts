import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LOGIN_URL = '/login';

export async function middleware(request: NextRequest) {
  // Get Token
  const token = request.cookies.get('token')?.value;
  const { pathname, search } = request.nextUrl;
  const redirectTo = encodeURIComponent(pathname + search);

  const redirect = (url: string) =>
    NextResponse.redirect(new URL(url, request.url));

  if (!token && pathname !== LOGIN_URL) {
    console.log("!TOKEN");
    return redirect(`${LOGIN_URL}?redirectTo=${redirectTo}`);
  }
  if (!token && pathname === LOGIN_URL) {
    return NextResponse.next();
  }
  if (token && pathname === LOGIN_URL) {
    return redirect("/");
  }

  if (token) {
    // TODO: Validation if token expired, redirect to login page and remove token cookies
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
