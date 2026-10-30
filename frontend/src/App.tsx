import ShortenerPanel from './components/organisms/ShortenerPanel'

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M9.7 14.3 14.3 9.7m-7.1 7.1-1.1 1.1a4 4 0 0 1-5.7-5.7l4-4a4 4 0 0 1 5.7 0m3.9 3.8a4 4 0 0 1 5.7 0 4 4 0 0 1 0 5.7l-4 4a4 4 0 0 1-5.7 0"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}

function App() {
  return (
    <div className="app-shell">
      <header className="site-header shell flex items-center justify-between">
        <a className="brand flex items-center gap-3" href="/" aria-label="LinkCloud, inicio">
          <BrandMark />
          <span>LinkCloud</span>
        </a>
        <span className="header-note">
          <span className="header-note-dot" aria-hidden="true" />
          Acortador de enlaces
        </span>
      </header>

      <main className="main-layout shell mx-auto w-full max-w-6xl">
        <section className="intro-copy" aria-labelledby="page-title">
          <p className="eyebrow">
            <span className="eyebrow-line" aria-hidden="true" />
            ENLACES MÁS FÁCILES DE COMPARTIR
          </p>
          <h1 id="page-title">
            Menos URL.
            <br />
            <span>Más cerca.</span>
          </h1>
          <p className="intro-description">
            Convierte una dirección larga en un enlace simple, listo para enviar
            y abrir desde cualquier lugar.
          </p>
          <div className="privacy-note">
            <span className="privacy-check" aria-hidden="true">✓</span>
            <span>Sin cuenta. Solo pega y comparte.</span>
          </div>
        </section>

        <ShortenerPanel />
      </main>

      <footer className="site-footer shell">
        <span>LinkCloud</span>
        <span>Un enlace único para cada destino.</span>
      </footer>
    </div>
  )
}

export default App
