import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GeNCorE — Command Center',
  description: 'Panel sterowania agentami AI: Copilot, Claude, Codex',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#111827',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl" className="dark">
      <body className="bg-gray-900 text-white font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}
