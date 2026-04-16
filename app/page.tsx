'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import AgentCard, { AgentInfo } from '@/components/AgentCard'
import PRCard, { PullRequest } from '@/components/PRCard'
import { AGENTS, detectAgentFromPR } from '@/lib/agents'

export default function DashboardPage() {
  const [prs, setPrs] = useState<PullRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  const repoOwner = process.env.NEXT_PUBLIC_REPO_OWNER || 'marekdkropiewnicki-dotcom'
  const repoName = process.env.NEXT_PUBLIC_REPO_NAME || 'GentelmeN-CorE'

  const fetchPRs = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/prs')

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Błąd pobierania PR-ów')
      }

      const data = await res.json()
      setPrs(data.prs || [])
      setLastUpdated(new Date().toLocaleTimeString('pl-PL'))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPRs()
    // Odśwież co 60 sekund
    const interval = setInterval(fetchPRs, 60_000)
    return () => clearInterval(interval)
  }, [])

  // Przygotuj dane agentów z PR-ów, używając centralnej konfiguracji
  const agents: AgentInfo[] = AGENTS.map((config) => {
    const agentPRs = prs.filter(
      (pr) => detectAgentFromPR(pr.head.ref, pr.user.login)?.id === config.id
    )
    const latestPR = agentPRs[0]

    return {
      name: config.label,
      emoji: config.emoji,
      color: config.color,
      borderColor: config.borderColor,
      badgeColor: config.badgeColor,
      status: agentPRs.length > 0 ? 'busy' : 'online',
      lastPR: latestPR
        ? {
            title: latestPR.title,
            url: latestPR.html_url,
            state: latestPR.draft ? 'Draft' : 'Open',
          }
        : undefined,
    }
  })

  return (
    <div className="min-h-screen bg-gray-900 pb-24">
      {/* Nagłówek */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 pt-[env(safe-area-inset-top)]">
        <div className="max-w-2xl mx-auto py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              🤖 <span>GeNCorE</span>
              <span className="text-gray-400 font-normal text-sm">Command Center</span>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {repoOwner}/{repoName}
            </p>
          </div>
          <button
            onClick={fetchPRs}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700 active:bg-gray-600"
            title="Odśwież"
            aria-label="Odśwież listę PR-ów"
          >
            🔄
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-5 flex flex-col gap-6">
        {/* Agenci */}
        <section>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Status agentów
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {agents.map((agent) => (
              <AgentCard key={agent.name} agent={agent} />
            ))}
          </div>
        </section>

        {/* Aktywne PR-y */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
              Aktywne PR-y
              {!loading && (
                <span className="ml-2 text-purple-400 normal-case font-normal">
                  ({prs.length})
                </span>
              )}
            </h2>
            {lastUpdated && (
              <span className="text-xs text-gray-600">
                {lastUpdated}
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-gray-800 rounded-2xl h-24 animate-pulse border border-gray-700"
                />
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-900/30 border border-red-800 rounded-2xl px-4 py-5 text-center">
              <p className="text-red-400 text-sm mb-3">❌ {error}</p>
              <button
                onClick={fetchPRs}
                className="text-sm text-red-300 hover:text-red-200 underline"
              >
                Spróbuj ponownie
              </button>
            </div>
          ) : prs.length === 0 ? (
            <div className="bg-gray-800 border border-gray-700 rounded-2xl px-4 py-8 text-center">
              <p className="text-gray-500 text-sm">✅ Brak otwartych PR-ów</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {prs.map((pr) => (
                <PRCard key={pr.id} pr={pr} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Navbar />
    </div>
  )
}
