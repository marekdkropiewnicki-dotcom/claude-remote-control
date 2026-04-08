import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()
    const apiKey = request.headers.get('x-api-key')

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      )
    }

    if (!apiKey.startsWith('sk-ant-')) {
      return NextResponse.json(
        { error: 'Invalid API key format' },
        { status: 400 }
      )
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    const anthropic = new Anthropic({
      apiKey: apiKey,
    })

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 4096,
      messages: messages.map((msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    })

    if (!response.content || response.content.length === 0) {
      return NextResponse.json(
        { error: 'Empty response from Claude' },
        { status: 500 }
      )
    }

    const content = response.content[0]
    if (content.type === 'text') {
      return NextResponse.json({ content: content.text })
    }

    return NextResponse.json(
      { error: 'Unexpected response format from Claude' },
      { status: 500 }
    )
  } catch (error: unknown) {
    console.error('Error calling Claude API:', error)

    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `API Error: ${error.message}` },
        { status: error.status || 500 }
      )
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process request' },
      { status: 500 }
    )
  }
}