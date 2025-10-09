import { NextRequest, NextResponse } from 'next/server';

// Request monitoring middleware
export function middleware(request: NextRequest) {
  const startTime = Date.now();
  const requestId = crypto.randomUUID();

  // Add request ID to headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-request-id', requestId);

  // Simple logging for Edge Runtime
  console.log(`[${requestId}] ${request.method} ${request.nextUrl.pathname}`);

  // Create response
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Add response headers
  response.headers.set('x-request-id', requestId);
  response.headers.set('x-response-time', '0'); // Will be updated after processing

  // Calculate response time
  const endTime = Date.now();
  const responseTime = endTime - startTime;

  // Update response time header
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
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/health|_next/static|_next/image|favicon.ico).*)',
  ],
};
