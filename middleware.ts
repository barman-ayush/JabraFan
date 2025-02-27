// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that don't require authentication
const publicRoutes = [
  '/api/auth/sndotp',
  '/api/auth/verifyotp',
  '/login',
  '/register',
  '/forgot-password',
  '/',                  // Homepage
  '/about',
  '/contact',
  '/terms',
  '/privacy',
];

// Check if the route is public
const isPublicRoute = (path: string) => {
  return publicRoutes.some(route => path.startsWith(route)) || 
         path.includes('/static/') || 
         path.includes('/_next/') ||
         path.includes('/favicon.ico');
};

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Check if this is a public route
  if (isPublicRoute(path)) {
    return NextResponse.next();
  }
  
  // Check for auth cookie
  const authToken = request.cookies.get('auth_token')?.value;
  
  // If no auth token, redirect to login
  if (!authToken) {
    const loginUrl = new URL('/login', request.url);
    
    // Add a redirect_to query param to redirect after login
    loginUrl.searchParams.set('redirect_to', path);
    
    return NextResponse.redirect(loginUrl);
  }
  
  // Continue if authenticated
  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * We include public routes explicitly in the isPublicRoute function
     */
    '/((?!_next/static|_next/image).*)',
  ],
};