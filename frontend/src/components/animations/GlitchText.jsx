import React from 'react'
import { motion } from 'framer-motion'

const GlitchText = ({ children, className = "", delay = 0 }) => {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <motion.span
        className="block"
        animate={{
          textShadow: [
            "0 0 0px #19FFD6",
            "2px 0 0px #FF0040, -2px 0 0px #00FF41",
            "0 0 0px #19FFD6"
          ]
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatDelay: 2,
          delay
        }}
      >
        {children}
      </motion.span>
    </motion.div>
  )
}

export default GlitchText
