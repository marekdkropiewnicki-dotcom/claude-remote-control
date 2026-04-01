import { NextRequest, NextResponse } from 'next/server'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO_OWNER = process.env.NEXT_PUBLIC_REPO_OWNER || 'marekdkropiewnicki-dotcom'
const REPO_NAME = process.env.NEXT_PUBLIC_REPO_NAME || 'GentelmeN-CorE'

type ReviewEvent = 'APPROVE' | 'REQUEST_CHANGES' | 'COMMENT'

export async function POST(req: NextRequest) {
  if (!GITHUB_TOKEN) {
    return NextResponse.json(
      { error: 'Brak GITHUB_TOKEN — skonfiguruj zmienne środowiskowe' },
      { status: 500 }
    )
  }

  let body: { prNumber?: number; event?: ReviewEvent; body?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Nieprawidłowe dane JSON' }, { status: 400 })
  }

  const { prNumber, event = 'APPROVE', body: reviewBody = '' } = body

  if (!prNumber) {
    return NextResponse.json({ error: 'Wymagane pole: prNumber' }, { status: 400 })
  }

  // Walidacja: prNumber musi być dodatnią liczbą całkowitą (zapobiega SSRF)
  const safePrNumber = Math.floor(Number(prNumber))
  if (!Number.isInteger(safePrNumber) || safePrNumber <= 0 || safePrNumber > 2_147_483_647) {
    return NextResponse.json({ error: 'Nieprawidłowy numer PR' }, { status: 400 })
  }

  if (!['APPROVE', 'REQUEST_CHANGES', 'COMMENT'].includes(event)) {
    return NextResponse.json(
      { error: 'Nieprawidłowe event (dozwolone: APPROVE, REQUEST_CHANGES, COMMENT)' },
      { status: 400 }
    )
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/pulls/${safePrNumber}/reviews`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify({
          event,
          body: reviewBody,
        }),
      }
    )

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || 'Błąd review' },
        { status: res.status }
      )
    }

    return NextResponse.json({ review: data })
  } catch {
    return NextResponse.json(
      { error: 'Błąd połączenia z GitHub API' },
      { status: 500 }
    )
  }
}
