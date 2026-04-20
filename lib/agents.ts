/**
 * Centralna konfiguracja agentów AI.
 * Używana zarówno po stronie API jak i UI.
 */

export type AgentId = 'copilot' | 'claude' | 'codex'

export interface AgentConfig {
  id: AgentId
  /** Wyświetlana nazwa */
  label: string
  emoji: string
  /** GitHub login bota do assignee na issues */
  githubLogin: string
  /** Label dodawany do tworzonych Issues */
  issueLabel: string
  /** Klasy Tailwind dla karty agenta */
  color: string
  borderColor: string
  badgeColor: string
  /** Klasy dla zaznaczonego przycisku wyboru agenta */
  selectedBg: string
}

export const AGENTS: AgentConfig[] = [
  {
    id: 'copilot',
    label: 'GitHub Copilot',
    emoji: '🟣',
    githubLogin: 'copilot',
    issueLabel: 'agent:copilot',
    color: 'text-purple-400',
    borderColor: 'border-purple-700/50',
    badgeColor: 'bg-purple-700/60 text-purple-300',
    selectedBg: 'bg-purple-600/20 border-purple-500 text-purple-300',
  },
  {
    id: 'claude',
    label: 'Claude (Anthropic)',
    emoji: '🟠',
    // GitHub bot accounts appear as 'username[bot]' in the API
    githubLogin: 'claude[bot]',
    issueLabel: 'agent:claude',
    color: 'text-orange-400',
    borderColor: 'border-orange-700/50',
    badgeColor: 'bg-orange-700/60 text-orange-300',
    selectedBg: 'bg-orange-600/20 border-orange-400 text-orange-300',
  },
  {
    id: 'codex',
    label: 'Codex (OpenAI)',
    emoji: '🔵',
    // GitHub bot accounts appear as 'username[bot]' in the API
    githubLogin: 'codex[bot]',
    issueLabel: 'agent:codex',
    color: 'text-blue-400',
    borderColor: 'border-blue-700/50',
    badgeColor: 'bg-blue-700/60 text-blue-300',
    selectedBg: 'bg-blue-600/20 border-blue-500 text-blue-300',
  },
]

/** Mapowanie id → konfiguracja (do szybkiego lookup) */
export const AGENTS_BY_ID: Record<AgentId, AgentConfig> = Object.fromEntries(
  AGENTS.map((a) => [a.id, a])
) as Record<AgentId, AgentConfig>

/** Wszystkie poprawne id agentów */
export const AGENT_IDS: AgentId[] = AGENTS.map((a) => a.id)

/**
 * Rozpoznaje agenta na podstawie nazwy brancha lub loginu autora PR-a.
 * Zwraca AgentConfig lub null jeśli nie rozpoznano.
 */
export function detectAgentFromPR(
  headRef: string,
  authorLogin: string
): AgentConfig | null {
  const branch = headRef.toLowerCase()
  const author = authorLogin.toLowerCase()

  if (
    branch.includes('copilot') ||
    branch.includes('github-copilot') ||
    author.includes('copilot')
  ) {
    return AGENTS_BY_ID.copilot
  }
  if (
    branch.includes('claude') ||
    author.includes('claude') ||
    author.includes('anthropic')
  ) {
    return AGENTS_BY_ID.claude
  }
  if (
    branch.includes('codex') ||
    author.includes('codex') ||
    author.includes('openai')
  ) {
    return AGENTS_BY_ID.codex
  }
  return null
}
