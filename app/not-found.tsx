export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#f5cab9' }}>
      <div className="max-w-md w-full">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-7xl font-light" style={{ color: '#d4a694' }}>404</h1>
            <div className="h-0.5 w-16 mx-auto" style={{ backgroundColor: '#d4a694' }}></div>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-medium" style={{ color: '#7a4e3d' }}>Pagina Non Trovata</h2>
            <p className="leading-relaxed" style={{ color: '#9e6b57' }}>La pagina richiesta non è stata trovata in questa applicazione.</p>
          </div>
          <div className="pt-6">
            <a href="/" className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200" style={{ color: '#7a4e3d', backgroundColor: '#f0d5c8', border: '1px solid #e0bba8' }}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 001 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Torna alla Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
