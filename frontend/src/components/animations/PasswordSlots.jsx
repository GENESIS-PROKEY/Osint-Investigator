import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const PasswordSlots = ({ 
  onComplete = () => {},
  slots = 6,
  challenge = null 
}) => {
  const [currentSlots, setCurrentSlots] = useState(Array(slots).fill(0))
  const [isSpinning, setIsSpinning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [spinProgress, setSpinProgress] = useState(0)

  const symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const correctPositions = challenge?.correct_positions || Array(slots).fill(0).map(() => Math.floor(Math.random() * 36))

  const startSpinning = () => {
    if (isSpinning || isComplete) return

    setIsSpinning(true)
    setSpinProgress(0)

    // Random spinning for each slot
    const intervals = currentSlots.map((_, index) => {
      return setInterval(() => {
        setCurrentSlots(prev => {
          const newSlots = [...prev]
          newSlots[index] = Math.floor(Math.random() * 36)
          return newSlots
        })
      }, 100)
    })

    // Stop spinning after 3 seconds
    setTimeout(() => {
      intervals.forEach(interval => clearInterval(interval))
      
      // Set correct positions
      setCurrentSlots(correctPositions)
      setIsSpinning(false)
      setIsComplete(true)
      
      setTimeout(() => onComplete(), 1000)
    }, 3000)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-cyber-cyan mb-2">
          PASSWORD VERIFICATION
        </h3>
        <p className="text-gray-300 text-sm">
          Click to align the password slots
        </p>
      </div>

      {/* Password Slots */}
      <div className="flex justify-center space-x-2 mb-6">
        {currentSlots.map((position, index) => (
          <motion.div
            key={index}
            className="w-12 h-12 border-2 border-cyber-cyan bg-cyber-dark-gray flex items-center justify-center font-mono text-lg"
            animate={isSpinning ? { 
              scale: [1, 1.1, 1],
              boxShadow: ["0 0 0px #19FFD6", "0 0 20px #19FFD6", "0 0 0px #19FFD6"]
            } : {}}
            transition={{ 
              duration: 0.3, 
              repeat: isSpinning ? Infinity : 0 
            }}
          >
            {symbols[position]}
          </motion.div>
        ))}
      </div>

      {/* Start Button */}
      {!isSpinning && !isComplete && (
        <motion.button
          className="w-full py-3 bg-cyber-cyan text-cyber-darker font-bold hover:bg-cyber-cyan/80 transition-all"
          onClick={startSpinning}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          ALIGN PASSWORD
        </motion.button>
      )}

      {/* Spinning State */}
      {isSpinning && (
        <div className="text-center">
          <motion.div
            className="text-cyber-cyan font-mono mb-4"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            ALIGNING SLOTS...
          </motion.div>
          
          <div className="w-full h-2 bg-cyber-dark-gray border border-cyber-cyan overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-orange"
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "linear" }}
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
          <div className="text-4xl text-green-400 mb-2">🔓</div>
          <div className="text-cyber-cyan font-bold">PASSWORD ACCEPTED</div>
        </motion.div>
      )}
    </div>
  )
}

export default PasswordSlots
