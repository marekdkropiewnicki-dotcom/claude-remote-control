import { NextRequest, NextResponse } from 'next/server'

const ADMIN_TOKEN = process.env.ADMIN_TOKEN

// Trasy publiczne (nie wymagają logowania)
const PUBLIC_PATHS = ['/login', '/api/auth']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Przepuść zasoby statyczne i publiczne ścieżki
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/manifest') ||
    PUBLIC_PATHS.some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.next()
  }

  // Jeśli ADMIN_TOKEN nie jest ustawiony — nie blokuj (dev mode)
  if (!ADMIN_TOKEN) {
    return NextResponse.next()
  }

  const authCookie = req.cookies.get('auth')?.value

  if (authCookie !== ADMIN_TOKEN) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
