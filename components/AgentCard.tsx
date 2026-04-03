export interface AgentInfo {
  name: string
  emoji: string
  color: string
  borderColor: string
  badgeColor: string
  lastPR?: {
    title: string
    url: string
    state: string
  }
  status: 'online' | 'busy' | 'offline'
}

interface AgentCardProps {
  agent: AgentInfo
}

const statusLabel: Record<AgentInfo['status'], string> = {
  online: 'Aktywny',
  busy: 'Zajęty',
  offline: 'Offline',
}

const statusDot: Record<AgentInfo['status'], string> = {
  online: 'bg-green-400',
  busy: 'bg-yellow-400',
  offline: 'bg-gray-500',
}

export default function AgentCard({ agent }: AgentCardProps) {
  return (
    <div
      className={`bg-gray-800 rounded-2xl p-4 border ${agent.borderColor} flex flex-col gap-3`}
    >
      {/* Nagłówek agenta */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{agent.emoji}</span>
          <span className={`font-bold text-lg ${agent.color}`}>
            {agent.name}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${statusDot[agent.status]} ${
              agent.status === 'online' ? 'animate-pulse' : ''
            }`}
          />
          <span className="text-xs text-gray-400">
            {statusLabel[agent.status]}
          </span>
        </div>
      </div>

      {/* Ostatni PR */}
      {agent.lastPR ? (
        <div className="bg-gray-700/50 rounded-xl p-3">
          <p className="text-xs text-gray-400 mb-1">Ostatni PR</p>
          <a
            href={agent.lastPR.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-200 hover:text-white line-clamp-2 block"
          >
            {agent.lastPR.title}
          </a>
          <span
            className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${agent.badgeColor}`}
          >
            {agent.lastPR.state}
          </span>
        </div>
      ) : (
        <div className="bg-gray-700/30 rounded-xl p-3">
          <p className="text-xs text-gray-500">Brak aktywnych PR-ów</p>
        </div>
      )}
    </div>
  )
}
