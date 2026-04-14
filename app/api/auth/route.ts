import { NextRequest, NextResponse } from 'next/server'
import { hashAdminToken } from '@/lib/auth'

const ADMIN_TOKEN = process.env.ADMIN_TOKEN

export async function POST(req: NextRequest) {
  if (!ADMIN_TOKEN) {
    return NextResponse.json(
      { error: 'Autentykacja nie jest skonfigurowana (brak ADMIN_TOKEN)' },
      { status: 500 }
    )
  }

  let body: { token?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Nieprawidłowe dane JSON' }, { status: 400 })
  }

  if (!body.token || body.token !== ADMIN_TOKEN) {
    return NextResponse.json({ error: 'Nieprawidłowy token' }, { status: 401 })
  }

  // Przechowuj HMAC-SHA256 tokenu zamiast samego tokenu
  const cookieValue = await hashAdminToken(ADMIN_TOKEN)

  const response = NextResponse.json({ ok: true })
  response.cookies.set('auth', cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 dni
    path: '/',
  })
  return response
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.delete('auth')
  return response
}

