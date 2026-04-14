import { detectAgentFromPR } from '@/lib/agents'

export interface PullRequest {
  id: number
  number: number
  title: string
  user: { login: string }
  state: string
  draft: boolean
  html_url: string
  created_at: string
  head: { ref: string }
  base: { ref: string }
  labels: { name: string; color: string }[]
  body?: string
}

interface PRCardProps {
  pr: PullRequest
  onApprove?: (prNumber: number) => void
  onRequestChanges?: (prNumber: number) => void
  onMerge?: (prNumber: number) => void
  loading?: boolean
}

export default function PRCard({
  pr,
  onApprove,
  onRequestChanges,
  onMerge,
  loading,
}: PRCardProps) {
  const agentConfig = detectAgentFromPR(pr.head.ref, pr.user.login)
  const agentLabel = agentConfig?.label ?? pr.user.login
  const agentColor = agentConfig?.color ?? 'text-gray-400'

  const stateStyles = pr.draft
    ? 'bg-gray-600 text-gray-300'
    : pr.state === 'open'
    ? 'bg-green-700/60 text-green-300'
    : 'bg-purple-700/60 text-purple-300'

  const stateLabel = pr.draft ? 'Draft' : pr.state === 'open' ? 'Open' : 'Merged'

  return (
    <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700 flex flex-col gap-3">
      {/* Nagłówek */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <a
            href={pr.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-gray-100 hover:text-white line-clamp-2 block leading-snug"
          >
            {pr.title}
          </a>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs font-medium ${agentColor}`}>
              {agentLabel}
            </span>
            <span className="text-xs text-gray-500">
              #{pr.number} · {pr.head.ref}
            </span>
          </div>
        </div>
        <span
          className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${stateStyles}`}
        >
          {stateLabel}
        </span>
      </div>

      {/* Przyciski akcji (opcjonalne) */}
      {(onApprove || onRequestChanges || onMerge) && !pr.draft && pr.state === 'open' && (
        <div className="flex gap-2 flex-wrap">
          {onApprove && (
            <button
              onClick={() => onApprove(pr.number)}
              disabled={loading}
              className="flex-1 text-sm bg-green-600 hover:bg-green-500 active:bg-green-700 text-white rounded-xl py-2 px-3 transition-colors disabled:opacity-50"
            >
              ✓ Approve
            </button>
          )}
          {onRequestChanges && (
            <button
              onClick={() => onRequestChanges(pr.number)}
              disabled={loading}
              className="flex-1 text-sm bg-yellow-600 hover:bg-yellow-500 active:bg-yellow-700 text-white rounded-xl py-2 px-3 transition-colors disabled:opacity-50"
            >
              ↩ Zmiany
            </button>
          )}
          {onMerge && (
            <button
              onClick={() => onMerge(pr.number)}
              disabled={loading}
              className="flex-1 text-sm bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white rounded-xl py-2 px-3 transition-colors disabled:opacity-50"
            >
              ↑ Merge
            </button>
          )}
        </div>
      )}
    </div>
  )
}
