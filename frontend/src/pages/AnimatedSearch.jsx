import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { search as searchApi } from '../utils/api'
import ConnectionSequence from '../components/animations/ConnectionSequence'
import TerminalText from '../components/animations/TerminalText'
import ProgressScanner from '../components/animations/ProgressScanner'
import GlitchText from '../components/animations/GlitchText'
import Toast from '../components/ui/Toast'
import { SearchResultsSkeleton } from '../components/ui/Skeleton'

const AnimatedSearch = () => {
  const [query, setQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchState, setSearchState] = useState('idle') // idle, connecting, scanning, results, error
  const [scanProgress, setScanProgress] = useState(0)
  const [terminalText, setTerminalText] = useState('')
  const navigate = useNavigate()
  const useMock = (import.meta && import.meta.env && import.meta.env.VITE_USE_MOCK) === '1'
  const [recent, setRecent] = useState(() => {
    try { return JSON.parse(localStorage.getItem('recent_queries') || '[]') } catch { return [] }
  })
  const [showSuggestions, setShowSuggestions] = useState(false)

  const dataTypes = [
    { id: 'all', label: 'All' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
    { id: 'username', label: 'Username' },
    { id: 'vehicle', label: 'Vehicle' },
    { id: 'upi', label: 'UPI ID' }
  ]

  const terminalMessages = [
    "INITIALIZING SEARCH PROTOCOL...",
    "CONNECTING TO DATABASES...",
    "SCANNING DATA SOURCES...",
    "PROCESSING RESULTS...",
    "SEARCH COMPLETE"
  ]

  const handleConnectionComplete = () => {
    setSearchState('scanning')
    startSearch()
  }

  const startSearch = async () => {
    setLoading(true)
    setScanProgress(0)

    // Simulate scanning animation
    const scanInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(scanInterval)
          return 100
        }
        return prev + 10
      })
    }, 100)

    // Show terminal messages
    let messageIndex = 0
    const messageInterval = setInterval(() => {
      if (messageIndex < terminalMessages.length) {
        setTerminalText(terminalMessages[messageIndex])
        messageIndex++
      } else {
        clearInterval(messageInterval)
      }
    }, 800)

    try {
      if (useMock) {
        const mock = {
          email: { count: 3, results: [ { value: `${query}@gmail.com` }, { value: `${query}@yahoo.com` }, { value: `${query}@outlook.com` } ] },
          phone: { count: 2, results: [ { value: '+1-555-0123' }, { value: '+1-555-0456' } ] },
          username: { count: 1, results: [ { value: `@${query}` } ] },
          upi: { count: 1, results: [ { value: `${query}@upi` } ] },
          vehicle: { count: 0, results: [] },
        }
        const filtered = selectedType === 'all' ? mock : { [selectedType]: mock[selectedType] }
        setResults(filtered)
        setSearchState('results')
        // track recent
        const next = [query, ...recent.filter(q => q !== query)].slice(0, 5)
        setRecent(next)
        localStorage.setItem('recent_queries', JSON.stringify(next))
        return
      }

      const response = await searchApi.search(
        query,
        selectedType === 'all' ? null : selectedType
      )
      setResults(response.data.results_by_type)
      setSearchState('results')
      const next = [query, ...recent.filter(q => q !== query)].slice(0, 5)
      setRecent(next)
      localStorage.setItem('recent_queries', JSON.stringify(next))
      
    } catch (err) {
      clearInterval(scanInterval)
      clearInterval(messageInterval)
      const errorMsg = err.response?.data?.detail || 'Search failed'
      setError(errorMsg)
      setSearchState('error')
      
      if (err.response?.status === 401) {
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (!query || query.length < 2) {
      setError('Query must be at least 2 characters')
      return
    }
    setError('')
    setSearchState('connecting')
  }

  const resetSearch = () => {
    setSearchState('idle')
    setError('')
    setScanProgress(0)
    setTerminalText('')
    setResults(null)
  }

  return (
    <div className="min-h-screen bg-cyber-darker p-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(25, 255, 214, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(25, 255, 214, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          className="text-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <GlitchText className="text-4xl font-bold text-cyber-cyan mb-4">
            SEARCH INTERFACE
          </GlitchText>
        </motion.div>

        {/* Connection Header Strip */}
        <AnimatePresence>
          {(searchState === 'connecting' || searchState === 'scanning') && (
            <motion.div
              className="cyber-border bg-cyber-dark-gray/60 backdrop-blur-sm px-4 py-3 flex items-center justify-between"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <span className="font-mono text-cyber-cyan text-sm">
                {searchState === 'connecting' ? 'ESTABLISHING SECURE CONNECTION TO DATABASES...' : 'SCANNING DATA SOURCES...'}
              </span>
              <span className="text-cyber-gray text-xs">{useMock ? 'DEMO MODE' : 'LIVE'}</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Search Form */}
        <AnimatePresence>
          {searchState === 'idle' && (
            <motion.form 
              onSubmit={handleSearch} 
              className="cyber-border p-8 bg-cyber-dark-gray/50 backdrop-blur-sm"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8 }}
            >
              {error && <Toast type="error">{error}</Toast>}
              
              <div className="mb-6 relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true) }}
                  placeholder="Enter search query..."
                  className="input-cyber w-full text-xl py-4"
                  required
                  minLength={2}
                />
                {showSuggestions && (recent.length > 0) && (
                  <div className="absolute left-0 right-0 mt-1 bg-cyber-dark-gray border border-cyber-cyan/40 z-20">
                    {recent.map((r) => (
                      <button
                        key={r}
                        type="button"
                        className="w-full text-left px-4 py-2 text-cyber-gray hover:text-cyber-cyan hover:bg-black/30"
                        onClick={() => { setQuery(r); setShowSuggestions(false) }}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex gap-4 mb-6 flex-wrap">
                {dataTypes.map(type => (
                  <motion.button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedType(type.id)}
                    className={`px-4 py-2 border-2 transition-all ${
                      selectedType === type.id
                        ? 'border-cyber-cyan bg-cyber-cyan text-cyber-darker'
                        : 'border-cyber-gray text-cyber-gray hover:border-cyber-cyan'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {type.label}
                  </motion.button>
                ))}
              </div>
              
              <motion.button 
                type="submit" 
                className="btn-cyber w-full text-xl py-4" 
                disabled={loading || !query || query.length < 2}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                INITIATE SEARCH
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Establishing Connection */}
        <AnimatePresence>
          {searchState === 'connecting' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              <ConnectionSequence onComplete={handleConnectionComplete} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Terminal Display */}
        <AnimatePresence>
          {searchState === 'scanning' && (
            <motion.div
              className="cyber-border p-6 bg-black font-mono text-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <TerminalText 
                text={terminalText}
                speed={30}
                showCursor={true}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Scanner */}
        <AnimatePresence>
          {searchState === 'scanning' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProgressScanner 
                progress={scanProgress}
                label="SCANNING DATABASES"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Display */}
        <AnimatePresence>
          {searchState === 'results' && results && (
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {Object.entries(results).map(([type, data], index) => (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  className="cyber-border p-6 bg-cyber-dark-gray/50 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-cyber-cyan uppercase">
                      {type}: {data.count} results
                    </h3>
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 border border-cyber-cyan text-cyber-cyan text-xs hover:bg-cyber-cyan hover:text-cyber-darker"
                        onClick={() => startSearch()}
                      >
                        RUN AGAIN
                      </button>
                      <button
                        className="px-3 py-1 border border-cyber-cyan text-cyber-cyan text-xs hover:bg-cyber-cyan hover:text-cyber-darker"
                        onClick={() => {
                          const saved = JSON.parse(localStorage.getItem('saved_searches') || '[]')
                          const entry = { query, type, ts: Date.now() }
                          localStorage.setItem('saved_searches', JSON.stringify([entry, ...saved]))
                        }}
                      >
                        SAVE SEARCH
                      </button>
                    </div>
                  </div>
                  {data.count > 0 && data.results.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {data.results.slice(0, 5).map((result, idx) => (
                        <motion.li 
                          key={idx} 
                          className="text-cyber-gray text-sm"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: (index * 0.2) + (idx * 0.1) }}
                        >
                          {result.value}
                        </motion.li>
                      ))}
                    </ul>
                  )}
                  {data.count === 0 && (
                    <p className="text-cyber-gray">No results found</p>
                  )}
                </motion.div>
              ))}
              
              <motion.div 
                className="text-center mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <motion.button
                  className="btn-cyber"
                  onClick={resetSearch}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  NEW SEARCH
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {searchState === 'error' && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.button
                className="btn-cyber"
                onClick={resetSearch}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                TRY AGAIN
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default AnimatedSearch
