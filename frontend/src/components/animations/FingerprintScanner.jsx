import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const FingerprintScanner = ({ 
  onComplete = () => {},
  challenge = null 
}) => {
  const [selectedFingerprints, setSelectedFingerprints] = useState([])
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  // Generate 8 random fingerprint patterns
  const fingerprints = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    pattern: `fingerprint_${i}`,
    isTarget: challenge ? i === challenge.targetIndex : Math.random() > 0.5
  }))

  const handleFingerprintClick = (fingerprint) => {
    if (isComplete || isScanning) return

    setSelectedFingerprints(prev => {
      const newSelection = prev.includes(fingerprint.id) 
        ? prev.filter(id => id !== fingerprint.id)
        : [...prev, fingerprint.id]
      
      return newSelection
    })
  }

  const startScanning = () => {
    if (selectedFingerprints.length === 0) return

    setIsScanning(true)
    setScanProgress(0)

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          setIsComplete(true)
          setTimeout(() => onComplete(), 1000)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-cyber-cyan mb-2">
          FINGERPRINT VERIFICATION
        </h3>
        <p className="text-gray-300 text-sm">
          Select matching fingerprints to proceed
        </p>
      </div>

      <div className="text-center mb-4 font-mono text-xs text-cyber-gray">
        Match the fingerprints to continue
      </div>

      {/* Fingerprint Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {fingerprints.map((fingerprint) => (
          <motion.div
            key={fingerprint.id}
            className={`
              w-16 h-16 border-2 rounded-lg cursor-pointer flex items-center justify-center transition-shadow
              ${selectedFingerprints.includes(fingerprint.id)
                ? 'border-cyber-cyan bg-cyber-cyan/20 shadow-[0_0_20px_rgba(25,255,214,0.3)]'
                : 'border-cyber-gray hover:border-cyber-cyan'
              }
            `}
            onClick={() => handleFingerprintClick(fingerprint)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-cyber-cyan to-cyber-orange rounded-full opacity-60" />
          </motion.div>
        ))}
      </div>

      {/* Scan Button */}
      {!isScanning && !isComplete && (
        <motion.button
          className="w-full py-3 bg-cyber-cyan text-cyber-darker font-bold hover:bg-cyber-cyan/80 transition-all"
          onClick={startScanning}
          disabled={selectedFingerprints.length === 0}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          START SCAN
        </motion.button>
      )}

      {/* Scanning Progress */}
      {isScanning && (
        <div className="space-y-4">
          <div className="text-center">
            <motion.div
              className="text-cyber-cyan font-mono"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              SCANNING FINGERPRINTS...
            </motion.div>
          </div>
          
          <div className="w-full h-2 bg-cyber-dark-gray border border-cyber-cyan overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-orange"
              initial={{ width: 0 }}
              animate={{ width: `${scanProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Success State */}
      {isComplete && (
        <motion.div
          className="text-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-4xl text-green-400 mb-2">✓</div>
          <div className="text-cyber-cyan font-bold">VERIFICATION COMPLETE</div>
        </motion.div>
      )}
    </div>
  )
}

export default FingerprintScanner
