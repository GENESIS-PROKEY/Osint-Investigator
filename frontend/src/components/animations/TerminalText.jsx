import React, { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const TerminalText = ({ 
  text, 
  speed = 50, 
  className = "",
  onComplete = () => {},
  showCursor = true 
}) => {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    } else {
      onComplete()
    }
  }, [currentIndex, text, speed, onComplete])

  return (
    <div className={`font-mono ${className}`} aria-live="polite" role="status">
      <span className="text-cyber-cyan" aria-hidden="true">{'>'}</span>
      <span className="text-white ml-2">{displayedText}</span>
      {showCursor && !prefersReduced && (
        <motion.span
          className="inline-block w-2 h-5 bg-cyber-cyan ml-1"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </div>
  )
}

export default TerminalText
