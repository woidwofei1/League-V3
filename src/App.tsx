import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AppShell } from './components'
import { ThemeProvider } from './contexts/ThemeContext'
import {
  HomePage,
  ProfilePage,
  FaceOffPage,
  ArcadeMatchPage,
  DashboardPage,
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
            <Route path="/home" element={<DashboardPage />} />
            <Route path="/match/new" element={<ArcadeMatchPage />} />
            <Route path="/arcade" element={<ArcadeMatchPage />} />
            <Route path="/profile" element={<BentoProfilePage />} />
            
            {/* Legacy routes - redirect to new pages */}
            <Route path="/t/:tableSlug" element={<Navigate to="/home" replace />} />
            <Route path="/stats" element={<DashboardPage />} />
            <Route path="/history" element={<DashboardPage />} />
            <Route path="/rivalry" element={<DashboardPage />} />
            <Route path="/home-legacy" element={<HomePage />} />
            <Route path="/profile-legacy" element={<ProfilePage />} />
          </Routes>
        </AnimatePresence>
      </AppShell>
    </ThemeProvider>
  )
}

export default App
