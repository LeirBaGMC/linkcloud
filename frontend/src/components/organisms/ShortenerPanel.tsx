import { useState, type FormEvent } from 'react'
import {
  Button,
  Description,
  FieldError,
  Input,
  Label,
  TextField,
} from '@heroui/react'
import { createShortenedUrl } from '../../services/urlService'
import type { ShortenedUrl } from '../../types'

function LinkSymbol() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9.7 14.3 14.3 9.7m-7.1 7.1-1.1 1.1a4 4 0 0 1-5.7-5.7l4-4a4 4 0 0 1 5.7 0m3.9 3.8a4 4 0 0 1 5.7 0 4 4 0 0 1 0 5.7l-4 4a4 4 0 0 1-5.7 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CopySymbol({ copied }: { copied: boolean }) {
  return copied ? (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m5 12 4.5 4.5L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="8"
        y="8"
        width="12"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  )
}

function ShortenerPanel() {
  const [originalUrl, setOriginalUrl] = useState('')
  const [urlError, setUrlError] = useState('')
  const [requestError, setRequestError] = useState('')
  const [result, setResult] = useState<ShortenedUrl | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [copied, setCopied] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setUrlError('')
    setRequestError('')
    setResult(null)
    setCopied(false)

    const value = originalUrl.trim()
    let parsedUrl: URL

    try {
      parsedUrl = new URL(value)
    } catch {
      setUrlError('Escribe una URL completa, por ejemplo https://ejemplo.com')
      return
    }

    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      setUrlError('La URL debe comenzar con http:// o https://')
      return
    }

    setIsPending(true)
    try {
      const shortenedUrl = await createShortenedUrl(value)
      setResult(shortenedUrl)
    } catch (error) {
      setRequestError(
        error instanceof Error
          ? error.message
          : 'Ocurrió un error al crear el enlace.',
      )
    } finally {
      setIsPending(false)
    }
  }

  async function handleCopy() {
    if (!result) return

    try {
      await navigator.clipboard.writeText(result.short_url)
      setCopied(true)
      setRequestError('')
    } catch {
      setRequestError(
        'No se pudo copiar automáticamente. Selecciona el enlace y cópialo.',
      )
    }
  }

  function handleUrlChange(value: string) {
    setOriginalUrl(value)
    setUrlError('')
    setRequestError('')
    setResult(null)
    setCopied(false)
  }

  return (
    <section className="shortener-card" aria-labelledby="shortener-title">
      <div className="panel-heading">
        <span className="panel-symbol">
          <LinkSymbol />
        </span>
        <div>
          <p className="panel-kicker">TU ENLACE, MÁS SIMPLE</p>
          <h2 id="shortener-title">Acorta tu URL</h2>
        </div>
      </div>

      <p className="panel-description">
        Pega una dirección larga y crea un enlace corto para compartir.
      </p>

      <form
        className="shortener-form"
        onSubmit={handleSubmit}
        aria-busy={isPending}
        noValidate
      >
        <TextField
          className="url-field"
          isRequired
          isInvalid={Boolean(urlError)}
          name="original_url"
        >
          <Label>URL original</Label>
          <Input
            type="url"
            value={originalUrl}
            onChange={(event) => handleUrlChange(event.target.value)}
            placeholder="https://ejemplo.com/tu-pagina"
            autoComplete="url"
            aria-describedby="url-description"
          />
          <Description id="url-description">
            Incluye http:// o https:// al comienzo.
          </Description>
          <FieldError>{urlError}</FieldError>
        </TextField>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isPending={isPending}
          isDisabled={isPending || !originalUrl.trim()}
          className="shorten-button"
        >
          {isPending ? 'Creando enlace…' : 'Acortar enlace'}
        </Button>
      </form>

      {requestError ? (
        <div className="request-error" role="alert">
          <span className="error-symbol" aria-hidden="true">!</span>
          <p>{requestError}</p>
        </div>
      ) : null}

      {result ? (
        <div className="result-card" role="status" aria-live="polite">
          <div className="result-label">
            <span className="success-dot" aria-hidden="true" />
            Enlace listo
          </div>
          <div className="result-row">
            <div className="result-copy">
              <a
                className="short-url"
                href={result.short_url}
                target="_blank"
                rel="noreferrer"
              >
                {result.short_url}
              </a>
              <p className="original-preview" title={result.original_url}>
                {result.original_url}
              </p>
            </div>
            <Button
              type="button"
              variant={copied ? 'secondary' : 'outline'}
              size="md"
              onPress={handleCopy}
              className="copy-button"
              aria-label={copied ? 'Enlace copiado' : 'Copiar enlace corto'}
            >
              <CopySymbol copied={copied} />
              {copied ? 'Copiado' : 'Copiar'}
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default ShortenerPanel
