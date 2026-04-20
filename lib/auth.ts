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

/**
 * Stałoczasowe porównanie dwóch stringów.
 * Zapobiega atakom czasowym (timing attacks) przy weryfikacji tokenów/haseł.
 * Gdy długości się różnią, od razu zwraca false (nie ujawnia to zawartości).
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}
