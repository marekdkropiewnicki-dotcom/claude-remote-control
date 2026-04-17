'use client'

import { useState, useRef, useEffect } from 'react'
import styles from './page.module.css'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const generateMessageId = () => {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [isConfigured, setIsConfigured] = useState(false)
  const [persistApiKey, setPersistApiKey] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Check sessionStorage first (session-only storage)
    const sessionKey = sessionStorage.getItem('anthropic_api_key')
    const sessionPersist = sessionStorage.getItem('anthropic_api_key_persist') === 'true'
    
    // Check localStorage only if user explicitly opted in to persistence
    let persistedKey: string | null = null
    if (sessionPersist) {
      persistedKey = localStorage.getItem('anthropic_api_key')
    }
    
    const keyToUse = sessionKey || persistedKey
    if (keyToUse) {
      setApiKey(keyToUse)
      setIsConfigured(true)
      setPersistApiKey(sessionPersist)
    }
  }, [])

  const isValidApiKey = (key: string) => key.trim().startsWith('sk-ant-')

  const saveApiKey = () => {
    if (apiKey.trim() && isValidApiKey(apiKey)) {
      const trimmedKey = apiKey.trim()
      
      // Always store in sessionStorage (cleared when browser closes)
      sessionStorage.setItem('anthropic_api_key', trimmedKey)
      
      // Only persist to localStorage if user explicitly opts in
      if (persistApiKey) {
        localStorage.setItem('anthropic_api_key', trimmedKey)
        sessionStorage.setItem('anthropic_api_key_persist', 'true')
      } else {
        localStorage.removeItem('anthropic_api_key')
        sessionStorage.removeItem('anthropic_api_key_persist')
      }
      
      setIsConfigured(true)
    } else {
      alert('Invalid API key. The key should start with "sk-ant-".')
    }
  }

  const clearApiKey = () => {
    localStorage.removeItem('anthropic_api_key')
    sessionStorage.removeItem('anthropic_api_key')
    sessionStorage.removeItem('anthropic_api_key_persist')
    setApiKey('')
    setIsConfigured(false)
    setPersistApiKey(false)
    setMessages([])
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { id: generateMessageId(), role: 'user', content: input.trim() }
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
        id: generateMessageId(),
        role: 'assistant',
        content: data.content,
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: generateMessageId(),
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
          <label className={styles.persistCheckbox}>
            <input
              type="checkbox"
              checked={persistApiKey}
              onChange={(e) => setPersistApiKey(e.target.checked)}
            />
            <span>Remember API key across browser sessions (less secure)</span>
          </label>
          <p className={styles.note}>
            Your API key is stored in your browser&apos;s session memory by default and will be
             cleared when you close your browser. It may be sent to our server only to process
             your chat requests, and it is not stored or persisted by us. If you enable
             persistent storage, your key will remain on this device until manually cleared.
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
          {messages.map((message) => (
            <div
              key={message.id}
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