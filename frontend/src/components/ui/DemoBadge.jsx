import React from 'react'

const DemoBadge = () => {
  const isDemo = (import.meta.env?.VITE_USE_MOCK) === '1'
  if (!isDemo) return null
  return (
    <div className="fixed bottom-4 right-4 z-50 px-3 py-1 border border-cyber-cyan text-cyber-cyan bg-cyber-dark-gray/70 backdrop-blur-sm font-mono text-xs">
      DEMO MODE
    </div>
  )
}

export default DemoBadge


