import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'


import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'
import { AuthGate } from './components'
import { BootTrace } from './components/BootTrace'
import { ErrorBoundary } from './components/ErrorBoundary'
import { TrashTalkProvider } from './contexts/TrashTalkContext'
import { trace } from './lib/bootTrace'

// Register PWA service worker with auto-update
const updateSW = registerSW({
  onNeedRefresh() {
    // When new content is available, auto-update
    // For a better UX, you could show a toast here asking user to refresh
    trace('pwa: new content available, updating...');
    updateSW(true);
  },
  onOfflineReady() {
    trace('pwa: app ready for offline use');
  },
  onRegistered(registration) {
    trace('pwa: service worker registered', { scope: registration?.scope });
  },
  onRegisterError(error) {
    trace('pwa: service worker registration error', { error: String(error) });
  },
});

trace('main: render start');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <BootTrace />
        <Routes>
          {/* All routes go through AuthGate (anonymous session + access code) */}
          <Route path="/*" element={
            <AuthGate>
              <TrashTalkProvider>
                <App />
              </TrashTalkProvider>
            </AuthGate>
          } />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)

trace('main: render called');
