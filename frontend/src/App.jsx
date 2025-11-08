import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import DemoBadge from './components/ui/DemoBadge'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ui/ErrorBoundary'
const EnhancedLanding = lazy(() => import('./pages/EnhancedLanding'))
const AnimatedLogin = lazy(() => import('./pages/AnimatedLogin'))
const AnimatedRegister = lazy(() => import('./pages/AnimatedRegister'))
const AnimatedDashboard = lazy(() => import('./pages/AnimatedDashboard'))
const AnimatedSearch = lazy(() => import('./pages/AnimatedSearch'))
const Pricing = lazy(() => import('./pages/Pricing'))
const AdminPanel = lazy(() => import('./pages/AdminPanel'))

function App() {
  const location = useLocation()
  return (
    <div className="min-h-screen bg-cyber-darker">
      <DemoBadge />
      <ErrorBoundary>
        <Suspense fallback={<div className="p-8 text-cyber-cyan">LOADING...</div>}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Routes location={location}>
        <Route path="/" element={<EnhancedLanding />} />
        <Route path="/login" element={<AnimatedLogin />} />
        <Route path="/register" element={<AnimatedRegister />} />
        <Route path="/pricing" element={<Pricing />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AnimatedDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <AnimatedSearch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

export default App
