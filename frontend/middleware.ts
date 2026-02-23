import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();

    // Attempt to get the hostname directly from the header to support local/prod domains dynamically
    const hostname = req.headers.get('host') || '';

    // Next.js static asset bypass
    if (url.pathname.startsWith('/_next') || url.pathname.startsWith('/api') || url.pathname.includes('.')) {
        return NextResponse.next();
    }

    // Check if the current domain starts with "merchant-" or "merchant."
    // Examples: merchant-golemarket.vercel.app, merchant.localhost:3000
    const isMerchantDomain = hostname.startsWith('merchant-') || hostname.startsWith('merchant.');

    if (isMerchantDomain) {
        // Render the dedicated Seller Homepage on root.
        if (url.pathname === '/') {
            url.pathname = '/seller';
            return NextResponse.rewrite(url);
        }

        // Block customer auth/dashboard routes and force them into seller experiences
        if (url.pathname === '/login') {
            url.pathname = '/seller/login';
            return NextResponse.rewrite(url);
        }

        if (url.pathname === '/register') {
            url.pathname = '/seller/register';
            return NextResponse.rewrite(url);
        }

        if (url.pathname === '/dashboard') {
            url.pathname = '/seller/dashboard';
            return NextResponse.rewrite(url);
        }
    }

    // Default return for all other domains (e.g. customer marketplace)
    return NextResponse.next();
}

// Config blocks Next.js from running middleware uselessly on images, APIs, etc
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
