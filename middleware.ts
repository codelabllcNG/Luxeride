import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value;

  const protectedPaths = ['/dashboard', '/profile'];
  
  const isProtected = protectedPaths.some((path) => 
    request.nextUrl.pathname.startsWith(path)
  );
  
  if (isProtected && !token) {
    
    return NextResponse.redirect(new URL('/login', request.url));
 
  }

  if (request.nextUrl.pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};