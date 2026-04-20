'use client'

import { useState, type FormEvent } from 'react'
import { AGENTS, type AgentId } from '@/lib/agents'

interface Task {
  id: string
  agent: AgentId
  description: string
  issueUrl?: string
  createdAt: string
}

interface TaskFormProps {
  onSubmit?: (task: Task) => void
}

export default function TaskForm({ onSubmit }: TaskFormProps) {
  const [selectedAgent, setSelectedAgent] = useState(AGENTS[0].id)
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!description.trim()) return

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch('/api/task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent: selectedAgent, description }),
      })

      if (!res.ok) {
        let errMsg = `HTTP ${res.status}: Błąd tworzenia zadania`
        try {
          const errData = await res.json()
          if (errData.error) errMsg = errData.error
        } catch {
          // keep default message
        }
        throw new Error(errMsg)
      }

      const data = await res.json()

      const task: Task = {
        id: String(data.issue?.number || Date.now()),
        agent: selectedAgent,
        description,
        issueUrl: data.issue?.html_url,
        createdAt: new Date().toISOString(),
      }

      setSuccess(
        `Zadanie #${task.id} utworzone!${task.issueUrl ? ` → ${task.issueUrl}` : ''}`
      )
      setDescription('')
      onSubmit?.(task)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Wybór agenta */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Wybierz agenta
        </label>
        <div className="flex flex-col gap-2">
          {AGENTS.map((agent) => (
            <button
              key={agent.id}
              type="button"
              onClick={() => setSelectedAgent(agent.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left ${
                selectedAgent === agent.id
                  ? agent.selectedBg
                  : 'bg-gray-700/50 border-gray-600 text-gray-400 hover:border-gray-500'
              }`}
            >
              <span className="text-xl">{agent.emoji}</span>
              <span className="font-medium">{agent.label}</span>
              {selectedAgent === agent.id && (
                <span className="ml-auto text-xs opacity-70">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Opis zadania */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Opis zadania
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Opisz co agent ma zrobić..."
          rows={4}
          required
          className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none text-sm"
        />
      </div>

      {/* Komunikaty */}
      {error && (
        <div className="bg-red-900/40 border border-red-700 rounded-xl px-4 py-3 text-sm text-red-300">
          ❌ {error}
        </div>
      )}
      {success && (
        <div className="bg-green-900/40 border border-green-700 rounded-xl px-4 py-3 text-sm text-green-300">
          ✅ {success}
        </div>
      )}

      {/* Przycisk */}
      <button
        type="submit"
        disabled={loading || !description.trim()}
        className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
      >
        {loading ? '⏳ Tworzenie...' : '🚀 Zleć zadanie'}
      </button>
    </form>
  )
}

