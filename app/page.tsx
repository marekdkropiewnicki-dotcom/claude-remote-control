'use client'

import { useState, useRef, useEffect } from 'react'
import styles from './page.module.css'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [isConfigured, setIsConfigured] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const savedKey = localStorage.getItem('anthropic_api_key')
    if (savedKey) {
      setApiKey(savedKey)
      setIsConfigured(true)
    }
  }, [])

  const isValidApiKey = (key: string) => key.trim().startsWith('sk-ant-')

  const saveApiKey = () => {
    if (apiKey.trim() && isValidApiKey(apiKey)) {
      localStorage.setItem('anthropic_api_key', apiKey.trim())
      setIsConfigured(true)
    } else {
      alert('Nieprawidłowy klucz API. Klucz powinien zaczynać się od "sk-ant-".')
    }
  }

  const clearApiKey = () => {
    localStorage.removeItem('anthropic_api_key')
    setApiKey('')
    setIsConfigured(false)
    setMessages([])
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input.trim() }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.content,
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to get response from Claude'}`,
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  if (!isConfigured) {
    return (
      <main className={styles.main}>
        <div className={styles.configContainer}>
          <h1 className={styles.title}>Claude Remote Control</h1>
          <p className={styles.description}>
            Enter your Anthropic API key to get started
          </p>
          <div className={styles.configForm}>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant..."
              className={styles.apiKeyInput}
              onKeyDown={(e) => e.key === 'Enter' && saveApiKey()}
            />
            <button
              onClick={saveApiKey}
              className={styles.saveButton}
              disabled={!apiKey.trim() || !isValidApiKey(apiKey)}
            >
              Save API Key
            </button>
          </div>
          <p className={styles.note}>
            Your API key is stored locally in your browser and never sent to our servers.
            It&apos;s only used to communicate directly with Anthropic&apos;s API.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>Claude Remote Control</h1>
        <div className={styles.controls}>
          <button onClick={clearChat} className={styles.clearButton}>
            Clear Chat
          </button>
          <button onClick={clearApiKey} className={styles.logoutButton}>
            Change API Key
          </button>
        </div>
      </div>

      <div className={styles.chatContainer}>
        <div className={styles.messages}>
          {messages.length === 0 && (
            <div className={styles.emptyState}>
              <h2>Welcome to Claude Remote Control</h2>
              <p>Start a conversation with Claude by typing a message below.</p>
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${styles.message} ${
                message.role === 'user' ? styles.userMessage : styles.assistantMessage
              }`}
            >
              <div className={styles.messageRole}>
                {message.role === 'user' ? 'You' : 'Claude'}
              </div>
              <div className={styles.messageContent}>{message.content}</div>
            </div>
          ))}
          {isLoading && (
            <div className={`${styles.message} ${styles.assistantMessage}`}>
              <div className={styles.messageRole}>Claude</div>
              <div className={styles.messageContent}>
                <div className={styles.loadingDots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className={styles.inputForm}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className={styles.input}
            disabled={isLoading}
          />
          <button
            type="submit"
            className={styles.sendButton}
            disabled={isLoading || !input.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </main>
  )
}