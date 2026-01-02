import { NextResponse } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request) {
  return NextResponse.redirect(new URL('/', request.url))
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/add-medication/:path*', '/dashboard/:path*',
    '/calendar/:path*', '/identifier/:path*', '/option/:path*', '/precautions/:path*',
'/search-results/:path*'],
}