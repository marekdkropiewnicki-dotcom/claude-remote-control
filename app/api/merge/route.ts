import { NextRequest, NextResponse } from 'next/server'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO_OWNER = process.env.NEXT_PUBLIC_REPO_OWNER || 'marekdkropiewnicki-dotcom'
const REPO_NAME = process.env.NEXT_PUBLIC_REPO_NAME || 'GentelmeN-CorE'

export async function POST(req: NextRequest) {
  if (!GITHUB_TOKEN) {
    return NextResponse.json(
      { error: 'Brak GITHUB_TOKEN — skonfiguruj zmienne środowiskowe' },
      { status: 500 }
    )
  }

  let body: { prNumber?: number; mergeMethod?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Nieprawidłowe dane JSON' }, { status: 400 })
  }

  const { prNumber, mergeMethod = 'squash' } = body

  if (!prNumber) {
    return NextResponse.json({ error: 'Wymagane pole: prNumber' }, { status: 400 })
  }

  // Walidacja: prNumber musi być dodatnią liczbą całkowitą (zapobiega SSRF)
  const safePrNumber = Math.floor(Number(prNumber))
  if (!Number.isInteger(safePrNumber) || safePrNumber <= 0 || safePrNumber > 2_147_483_647) {
    return NextResponse.json({ error: 'Nieprawidłowy numer PR' }, { status: 400 })
  }

  if (!['merge', 'squash', 'rebase'].includes(mergeMethod)) {
    return NextResponse.json(
      { error: 'Nieprawidłowa metoda merge (dozwolone: merge, squash, rebase)' },
      { status: 400 }
    )
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/pulls/${safePrNumber}/merge`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify({
          merge_method: mergeMethod,
        }),
      }
    )

    if (res.status === 204 || res.status === 200) {
      let data = { message: 'Merge zakończony sukcesem' }
      try {
        data = await res.json()
      } catch (err) {
        // 204 No Content — brak body, używamy domyślnej wiadomości
        console.log('Merge 204: brak body w odpowiedzi', err)
      }
      return NextResponse.json(data)
    }

    const err = await res.json()
    return NextResponse.json(
      { error: err.message || 'Błąd merge' },
      { status: res.status }
    )
  } catch {
    return NextResponse.json(
      { error: 'Błąd połączenia z GitHub API' },
      { status: 500 }
    )
  }
}
