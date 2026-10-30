import type { ShortenedUrl } from '../types'

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
).replace(/\/+$/, '')

export async function createShortenedUrl(
  originalUrl: string,
): Promise<ShortenedUrl> {
  let response: Response

  try {
    response = await fetch(API_BASE_URL + '/shorten', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ original_url: originalUrl }),
    })
  } catch {
    throw new Error(
      'No pudimos conectar con el backend. Comprueba que esté disponible y que permita este origen.',
    )
  }

  const body: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    const detail = (body as { detail?: unknown } | null)?.detail
    throw new Error(
      typeof detail === 'string'
        ? detail
        : 'No se pudo crear el enlace. Inténtalo de nuevo.',
    )
  }

  const shortUrl = (body as { short_url?: unknown } | null)?.short_url
  if (typeof shortUrl !== 'string') {
    throw new Error('El backend devolvió una respuesta que no reconocemos.')
  }

  return body as ShortenedUrl
}
