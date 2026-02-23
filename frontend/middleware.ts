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
        // If they navigate to the raw root path on the merchant domain, redirect or rewrite to seller dashboard
        if (url.pathname === '/') {
            url.pathname = '/seller/dashboard';
            return NextResponse.rewrite(url);
        }

        // If they navigate to a standard path on the merchant domain, rewrite it to point under the /seller tree
        // Example: merchant-golemarket.vercel.app/login -> rewrites to -> /seller/login
        if (!url.pathname.startsWith('/seller')) {
            url.pathname = `/seller${url.pathname}`;
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
