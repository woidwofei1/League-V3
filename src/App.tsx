import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AppShell } from './components'
import {
  HomePage,
  TablePage,
  NewMatchPage,
  RivalryPage,
  HistoryPage,
  StatsPage,
} from './pages'

function App() {
  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/t/:tableSlug" element={<TablePage />} />
          <Route path="/match/new" element={<NewMatchPage />} />
          <Route path="/rivalry" element={<RivalryPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </AnimatePresence>
    </AppShell>
  )
}

export default App
