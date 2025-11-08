import React from 'react'

const Toast = ({ type = 'error', children }) => (
  <div className={`fixed top-4 right-4 z-50 px-4 py-3 border bg-black/70 backdrop-blur-sm font-mono text-sm ${
    type === 'error' ? 'border-red-500 text-red-400' : 'border-cyber-cyan text-cyber-cyan'
  }`}>
    {children}
  </div>
)

export default Toast


