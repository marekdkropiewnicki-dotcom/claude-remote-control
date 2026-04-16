'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import PRCard, { PullRequest } from '@/components/PRCard'

type ActionResult = {
  prNumber: number
  action: 'approve' | 'merge' | 'changes'
  message: string
  success: boolean
}

export default function ReviewPage() {
  const [prs, setPrs] = useState<PullRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ActionResult | null>(null)

  const fetchPRs = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/prs')
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Błąd pobierania PR-ów')
      }
      const data = await res.json()
      setPrs(data.prs || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPRs()
  }, [])

  // Merge PR
  const handleMerge = async (prNumber: number) => {
    if (!confirm(`Merge PR #${prNumber}? Ta operacja jest nieodwracalna.`)) return
    setActionLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/merge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prNumber, mergeMethod: 'squash' }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Błąd merge')
      }
      setResult({
        prNumber,
        action: 'merge',
        message: 'Merge zakończony sukcesem ✅',
        success: true,
      })
      // Odśwież listę
      await fetchPRs()
    } catch (err) {
      setResult({
        prNumber,
        action: 'merge',
        message: err instanceof Error ? err.message : 'Błąd merge',
        success: false,
      })
    } finally {
      setActionLoading(false)
    }
  }

  // Approve PR przez server-side API route (używa GITHUB_TOKEN)
  const handleApprove = async (prNumber: number) => {
    setActionLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prNumber, event: 'APPROVE' }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Błąd zatwierdzania')
      }
      const data = await res.json()
      setResult({
        prNumber,
        action: 'approve',
        message: `PR #${prNumber} zatwierdzony ✅`,
        success: true,
      })
    } catch (err) {
      setResult({
        prNumber,
        action: 'approve',
        message: err instanceof Error ? err.message : 'Błąd zatwierdzania',
        success: false,
      })
    } finally {
      setActionLoading(false)
    }
  }

  // Request Changes — wywołuje /api/review z event REQUEST_CHANGES
  const handleRequestChanges = async (prNumber: number) => {
    const body = window.prompt('Komentarz do żądania zmian (opcjonalny):') ?? ''
    setActionLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prNumber, event: 'REQUEST_CHANGES', body }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Błąd żądania zmian')
      }
      setResult({
        prNumber,
        action: 'changes',
        message: `Zażądano zmian w PR #${prNumber} ✅`,
        success: true,
      })
    } catch (err) {
      setResult({
        prNumber,
        action: 'changes',
        message: err instanceof Error ? err.message : 'Błąd żądania zmian',
        success: false,
      })
    } finally {
      setActionLoading(false)
    }
  }

  // Podgląd diff — zawsze otwiera GitHub Files view w nowej karcie
  const openDiff = (htmlUrl: string) => {
    try {
      window.open(`${htmlUrl}/files`, '_blank')
    } catch (err) {
      console.error('Nie można otworzyć diff:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 pb-24">
      {/* Nagłówek */}
      <header className="bg-gray-800 border-b border-gray-700 px-4">
        <div className="max-w-2xl mx-auto py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">🔍 PR Review</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Przeglądaj i merguj pull requesty
            </p>
          </div>
          <button
            onClick={fetchPRs}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700"
            aria-label="Odśwież listę PR-ów"
            title="Odśwież listę PR-ów"
          >
            🔄
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-5 flex flex-col gap-4">
        {/* Wynik akcji */}
        {result && (
          <div
            className={`rounded-2xl px-4 py-3 text-sm ${
              result.success
                ? 'bg-green-900/40 border border-green-700 text-green-300'
                : 'bg-yellow-900/40 border border-yellow-700 text-yellow-300'
            }`}
          >
            {result.success ? '✅' : '⚠️'} {result.message}
          </div>
        )}

        {/* Lista PR-ów */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-gray-800 rounded-2xl h-32 animate-pulse border border-gray-700"
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
            <p className="text-gray-500 text-sm">✅ Brak otwartych PR-ów do review</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {prs.map((pr) => (
              <div key={pr.id} className="flex flex-col gap-2">
                <PRCard
                  pr={pr}
                  onApprove={handleApprove}
                  onRequestChanges={handleRequestChanges}
                  onMerge={handleMerge}
                  loading={actionLoading}
                />
                {/* Przycisk do podglądu diff */}
                <button
                  onClick={() => openDiff(pr.html_url)}
                  className="text-xs text-gray-500 hover:text-gray-300 text-left px-2 transition-colors"
                >
                  📄 Podgląd diff (otwiera w GitHub) →
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <Navbar />
    </div>
  )
}
