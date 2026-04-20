import { NextResponse } from 'next/server'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO_OWNER = process.env.NEXT_PUBLIC_REPO_OWNER || 'marekdkropiewnicki-dotcom'
const REPO_NAME = process.env.NEXT_PUBLIC_REPO_NAME || 'GentelmeN-CorE'

export async function GET() {
  if (!GITHUB_TOKEN) {
    return NextResponse.json(
      { error: 'Brak GITHUB_TOKEN — skonfiguruj zmienne środowiskowe' },
      { status: 500 }
    )
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/pulls?state=open&per_page=20`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        // Nie cachuj — zawsze świeże dane
        next: { revalidate: 0 },
      }
    )

    if (!res.ok) {
      const err = await res.json()
      return NextResponse.json(
        { error: err.message || 'Błąd GitHub API' },
        { status: res.status }
      )
    }

    const prs = await res.json()
    return NextResponse.json({ prs })
  } catch {
    return NextResponse.json(
      { error: 'Błąd połączenia z GitHub API' },
      { status: 500 }
    )
  }
}
