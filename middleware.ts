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

  // Jeśli ADMIN_TOKEN nie jest ustawiony, pozwól tylko poza production.
  // W production zakończ żądanie błędem, aby nie ujawnić chronionych tras.
  if (!ADMIN_TOKEN) {
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.next()
    }

    return new NextResponse('Server misconfiguration: ADMIN_TOKEN is not set.', {
      status: 500,
    })
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
