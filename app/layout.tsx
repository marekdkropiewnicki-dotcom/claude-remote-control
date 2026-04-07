import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Claude Remote Control',
  description: 'A web interface for remotely controlling and interacting with Claude AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
