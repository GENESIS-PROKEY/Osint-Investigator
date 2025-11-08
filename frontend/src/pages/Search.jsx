import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { search as searchApi } from '../utils/api'

const Search = () => {
  const [query, setQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const dataTypes = [
    { id: 'all', label: 'All' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
    { id: 'username', label: 'Username' },
    { id: 'vehicle', label: 'Vehicle' },
    { id: 'upi', label: 'UPI ID' }
  ]

  const handleSearch = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await searchApi.search(
        query,
        selectedType === 'all' ? null : selectedType
      )
      
      setResults(response.data.results_by_type)
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Search failed'
      setError(errorMsg)
      
      if (err.response?.status === 401) {
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cyber-darker p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-cyber-cyan">SEARCH</h1>
        
        <form onSubmit={handleSearch} className="cyber-border p-8 bg-cyber-dark-gray">
          {error && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500 text-red-500 text-sm">
              {error}
            </div>
          )}
          
          <div className="mb-6">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter search query..."
              className="input-cyber w-full text-xl py-4"
              required
              minLength={2}
            />
          </div>
          
          <div className="flex gap-4 mb-6 flex-wrap">
            {dataTypes.map(type => (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedType(type.id)}
                className={`px-4 py-2 border-2 transition-all ${
                  selectedType === type.id
                    ? 'border-cyber-cyan bg-cyber-cyan text-cyber-darker'
                    : 'border-cyber-gray text-cyber-gray hover:border-cyber-cyan'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
          
          <button type="submit" className="btn-cyber w-full" disabled={loading}>
            {loading ? 'SEARCHING...' : 'SEARCH'}
          </button>
        </form>

        {loading && (
          <div className="cyber-border p-8 bg-cyber-dark-gray text-center">
            <p className="text-cyber-cyan text-xl animate-pulse">PROCESSING...</p>
          </div>
        )}

        {results && (
          <div className="space-y-4">
            {Object.entries(results).map(([type, data], index) => (
              <motion.div
                key={type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="cyber-border p-6 bg-cyber-dark-gray"
              >
                <h3 className="text-xl font-bold text-cyber-cyan mb-2 uppercase">
                  {type}: {data.count} results
                </h3>
                {data.count > 0 && data.results.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {data.results.slice(0, 5).map((result, idx) => (
                      <li key={idx} className="text-cyber-gray text-sm">
                        {result.value}
                      </li>
                    ))}
                  </ul>
                )}
                {data.count === 0 && (
                  <p className="text-cyber-gray">No results found</p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Search
