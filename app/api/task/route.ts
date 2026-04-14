import { NextRequest, NextResponse } from 'next/server'
import { AGENTS_BY_ID, AGENT_IDS, AgentId } from '@/lib/agents'

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

  let body: { agent?: string; description?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Nieprawidłowe dane JSON' }, { status: 400 })
  }

  const { agent, description } = body

  if (!agent || !description?.trim()) {
    return NextResponse.json(
      { error: 'Wymagane pola: agent i description' },
      { status: 400 }
    )
  }

  // Walidacja: agent musi być jednym ze znanych identyfikatorów
  if (!AGENT_IDS.includes(agent as AgentId)) {
    return NextResponse.json(
      { error: `Nieznany agent. Obsługiwane: ${AGENT_IDS.join(', ')}` },
      { status: 400 }
    )
  }

  const agentConfig = AGENTS_BY_ID[agent as keyof typeof AGENTS_BY_ID]

  const issueBody = [
    `## Zlecenie dla ${agentConfig.label}`,
    '',
    description.trim(),
    '',
    '---',
    `*Zadanie utworzone przez GeNCorE Command Center · ${new Date().toLocaleString('pl-PL')}*`,
  ].join('\n')

  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify({
          title: `${agentConfig.emoji} [${agentConfig.label}] ${description.trim().slice(0, 80)}`,
          body: issueBody,
          labels: [agentConfig.issueLabel],
          assignees: [agentConfig.githubLogin],
        }),
      }
    )

    const issue = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { error: issue.message || 'Błąd tworzenia Issue' },
        { status: res.status }
      )
    }

    return NextResponse.json({ issue }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Błąd połączenia z GitHub API' },
      { status: 500 }
    )
  }
}

