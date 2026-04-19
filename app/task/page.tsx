'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import TaskForm from '@/components/TaskForm'
import { AGENTS_BY_ID, type AgentId } from '@/lib/agents'

interface TaskRecord {
  id: string
  agent: AgentId
  description: string
  issueUrl?: string
  createdAt: string
}

const STORAGE_KEY = 'gencore_tasks'

export default function TaskPage() {
  const [tasks, setTasks] = useState<TaskRecord[]>([])

  // Wczytaj historię z localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setTasks(JSON.parse(stored))
    } catch (err) {
      console.error('Nie można wczytać historii z localStorage:', err)
    }
  }, [])

  const handleTaskSubmit = (task: TaskRecord) => {
    setTasks((prev) => {
      const updated = [task, ...prev].slice(0, 20) // max 20 zadań
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (err) {
        console.error('Nie można zapisać do localStorage:', err)
      }
      return updated
    })
  }

  const clearHistory = () => {
    setTasks([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (err) {
      console.error('Nie można wyczyścić localStorage:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 pb-24">
      {/* Nagłówek */}
      <header className="bg-gray-800 border-b border-gray-700 px-4">
        <div className="max-w-2xl mx-auto py-4">
          <h1 className="text-xl font-bold text-white">📋 Panel zleceń</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Zlecaj zadania agentom AI
          </p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-5 flex flex-col gap-6">
        {/* Formularz */}
        <section className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
            Nowe zlecenie
          </h2>
          <TaskForm onSubmit={handleTaskSubmit} />
        </section>

        {/* Historia */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
              Historia
              {tasks.length > 0 && (
                <span className="ml-2 text-purple-400 normal-case font-normal">
                  ({tasks.length})
                </span>
              )}
            </h2>
            {tasks.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-xs text-gray-500 hover:text-red-400 transition-colors"
              >
                Wyczyść
              </button>
            )}
          </div>

          {tasks.length === 0 ? (
            <div className="bg-gray-800 border border-gray-700 rounded-2xl px-4 py-8 text-center">
              <p className="text-gray-500 text-sm">Brak historii zleceń</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-gray-800 border border-gray-700 rounded-2xl p-4 flex gap-3 items-start"
                >
                  <span className="text-xl shrink-0">
                    {AGENTS_BY_ID[task.agent]?.emoji || '🤖'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-400">
                        {AGENTS_BY_ID[task.agent]?.label || task.agent}
                      </span>
                      <span className="text-xs text-gray-600">
                        {new Date(task.createdAt).toLocaleString('pl-PL')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-200 line-clamp-2">
                      {task.description}
                    </p>
                    {task.issueUrl && (
                      <a
                        href={task.issueUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-purple-400 hover:text-purple-300 mt-1 block"
                      >
                        🔗 Otwórz Issue →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Navbar />
    </div>
  )
}
