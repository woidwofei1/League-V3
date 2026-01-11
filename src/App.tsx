import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AppShell } from './components'
import { ThemeProvider } from './contexts/ThemeContext'
import {
  HomePage,
  ProfilePage,
  FaceOffPage,
  ArcadeMatchPage,
  BentoProfilePage,
} from './pages'

function App() {
  return (
    <ThemeProvider>
      <AppShell>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Main Navigation (3 items: Home, Fight, Profile) */}
            <Route path="/" element={<FaceOffPage />} />
            <Route path="/home" element={<FaceOffPage />} />
            <Route path="/match/new" element={<ArcadeMatchPage />} />
            <Route path="/arcade" element={<ArcadeMatchPage />} />
            <Route path="/profile" element={<BentoProfilePage />} />

            {/* Legacy routes - redirect to new pages */}
            <Route path="/t/:tableSlug" element={<Navigate to="/" replace />} />
            <Route path="/stats" element={<FaceOffPage />} />
            <Route path="/history" element={<FaceOffPage />} />
            <Route path="/rivalry" element={<FaceOffPage />} />
            <Route path="/home-legacy" element={<HomePage />} />
            <Route path="/profile-legacy" element={<ProfilePage />} />
          </Routes>
        </AnimatePresence>
      </AppShell>
    </ThemeProvider>
  )
}

export default App
