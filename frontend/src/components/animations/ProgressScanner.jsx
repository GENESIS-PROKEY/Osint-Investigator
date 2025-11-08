import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const ProgressScanner = ({ 
  progress, 
  label = "SCANNING...", 
  className = "",
  showPercentage = true 
}) => {
  const [displayProgress, setDisplayProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayProgress(progress)
    }, 100)
    return () => clearTimeout(timer)
  }, [progress])

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-cyber-cyan font-mono text-sm">{label}</span>
        {showPercentage && (
          <span className="text-cyber-cyan font-mono text-sm">
            {Math.round(displayProgress)}%
          </span>
        )}
      </div>
      
      <div className="relative w-full h-2 bg-cyber-dark-gray border border-cyber-cyan overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyber-cyan to-cyber-orange"
          initial={{ width: 0 }}
          animate={{ width: `${displayProgress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        
        {/* Scanning line effect */}
        <motion.div
          className="absolute top-0 h-full w-1 bg-white opacity-80"
          animate={{ x: ["0%", "100%"] }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
      </div>
    </div>
  )
}

export default ProgressScanner
