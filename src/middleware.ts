import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Request monitoring and authentication middleware
export default async function middleware(request: NextRequest) {
  const startTime = Date.now();
  const requestId = crypto.randomUUID();

  // Add request ID to headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-request-id', requestId);

  // Simple logging for Edge Runtime
  console.log(`[${requestId}] ${request.method} ${request.nextUrl.pathname}`);

  // Auth check for protected routes
  const session = await auth();
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isProtectedRoute =
    request.nextUrl.pathname === '/' ||
    request.nextUrl.pathname.startsWith('/api/v1');

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Redirect to home if accessing auth pages while logged in
  if (isAuthPage && session && request.nextUrl.pathname !== '/auth/logout') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Create response
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Add response headers
  response.headers.set('x-request-id', requestId);

  // Calculate response time
  const responseTime = Date.now() - startTime;
  response.headers.set('x-response-time', responseTime.toString());

  // Simple response logging for Edge Runtime
  console.log(`[${requestId}] ${response.status} ${responseTime}ms`);

  return response;
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/health (health check should be fast)
     * - api/auth (NextAuth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/health|api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
