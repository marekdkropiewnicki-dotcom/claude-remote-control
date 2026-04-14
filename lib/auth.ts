/**
 * Narzędzia do autoryzacji sesji.
 * Używa Web Crypto API (crypto.subtle), które jest dostępne
 * zarówno w Node.js (v18+) jak i w Edge Runtime.
 */

const PAYLOAD = 'gencore:session:v1'

/**
 * Generuje HMAC-SHA256 z ADMIN_TOKEN.
 * Wartość ta jest przechowywana w cookie zamiast surowego tokenu.
 */
export async function hashAdminToken(adminToken: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(adminToken),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(PAYLOAD))
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
