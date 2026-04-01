import { NextRequest, NextResponse } from 'next/server'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO_OWNER = process.env.NEXT_PUBLIC_REPO_OWNER || 'marekdkropiewnicki-dotcom'
const REPO_NAME = process.env.NEXT_PUBLIC_REPO_NAME || 'GentelmeN-CorE'

// Mapowanie agentów na ich GitHub login (assignee)
const AGENT_LOGINS: Record<string, string> = {
  copilot: 'copilot',
  claude: 'claude[bot]',
  codex: 'codex[bot]',
}

const AGENT_LABELS: Record<string, string> = {
  copilot: 'agent:copilot',
  claude: 'agent:claude',
  codex: 'agent:codex',
}

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

  const agentLogin = AGENT_LOGINS[agent]
  const agentLabel = AGENT_LABELS[agent]

  // Etykieta agenta w tytule
  const agentEmoji =
    agent === 'copilot' ? '🟣' : agent === 'claude' ? '🟠' : '🔵'
  const agentName =
    agent === 'copilot'
      ? 'Copilot'
      : agent === 'claude'
      ? 'Claude'
      : 'Codex'

  const issueBody = [
    `## Zlecenie dla ${agentName}`,
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
          title: `${agentEmoji} [${agentName}] ${description.trim().slice(0, 80)}`,
          body: issueBody,
          labels: agentLabel ? [agentLabel] : [],
          ...(agentLogin ? { assignees: [agentLogin] } : {}),
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
