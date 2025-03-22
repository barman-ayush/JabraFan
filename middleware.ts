// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const CONFIG = {
  redirectToLandingPage: true,
  landingPageUrl: '/',
};

const publicRoutes = [
  '/api/auth/sendotp',
  '/api/auth/verifyotp',
  '/about',
  '/contact',
  '/terms',
  '/privacy',
  '/api/auth/parsecookie',
  '/api/leaderboard'
];

const assetPatterns = [
  '/static/',
  '/_next/',
  '/images/',
  '/favicon.ico',
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.svg',
  '.css',
  '.js',
];

const isPublicRoute = (path: string) => {
  if (path === '/' || path === '') {
    return true;
  }

  if (publicRoutes.some(route => path.startsWith(route))) {
    return true;
  }

  if (assetPatterns.some(pattern =>
    path.includes(pattern) || path.endsWith(pattern)
  )) {
    return true;
  }

  return false;
};

// Function to decode JWT token
const verifyToken = async (token: string) => {
  try {
    // Replace with your actual JWT secret from environment variables
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (isPublicRoute(path)) {
    return NextResponse.next();
  }

  // Authentication check
  const authToken = request.cookies.get('auth_token')?.value;

  if (!authToken) {
    console.log(`Protected route access attempt: ${path}`);

    if (CONFIG.redirectToLandingPage) {
      const redirectUrl = new URL(CONFIG.landingPageUrl, request.nextUrl.origin);
      redirectUrl.searchParams.set('isLoginNeeded', 'true');

      const currentUrl = request.nextUrl.pathname;
      if (request.nextUrl.search) {
        redirectUrl.searchParams.set('redirect_url', `${currentUrl}${request.nextUrl.search}`);
      } else {
        redirectUrl.searchParams.set('redirect_url', currentUrl);
      }

      return NextResponse.redirect(redirectUrl);
    }
  }

  // Special check for admin routes
  if (path.startsWith('/admin') || path.startsWith('/api/admin')) {
    try {
      const decodedToken = await verifyToken(authToken as string);
      
      if (!decodedToken) {
        const redirectUrl = new URL(CONFIG.landingPageUrl, request.nextUrl.origin);
        redirectUrl.searchParams.set('isUnauthorized', 'true');
        return NextResponse.redirect(redirectUrl);
      }
      
      // Check if the phone number in the token matches the admin phone in env
      const adminPhones = (process.env.ADMIN_PHONES || '').split(',').map(phone => phone.trim());
      
      if (!adminPhones.includes(decodedToken.phone as string)) {
        console.log(`Unauthorized admin access attempt: ${path} by ${decodedToken.phone}`);
        const redirectUrl = new URL(CONFIG.landingPageUrl, request.nextUrl.origin);
        redirectUrl.searchParams.set('isUnauthorized', 'true');
        return NextResponse.redirect(redirectUrl);
      }
      
      console.log(`Admin access granted to ${decodedToken.name} (${decodedToken.phone})`);
    } catch (error) {
      console.error('Error in admin route check:', error);
      const redirectUrl = new URL(CONFIG.landingPageUrl, request.nextUrl.origin);
      redirectUrl.searchParams.set('isUnauthorized', 'true');
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

// Improved matcher configuration
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|_static|_vercel|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:jpg|jpeg|gif|png|svg|css|js)).*)',
  ],
};