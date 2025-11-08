import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

const ScanOverlay = ({ intensity = 1 }) => {
  const particles = useMemo(() => Array.from({ length: Math.floor(40 * intensity) }), [intensity])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(25,255,214,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(25,255,214,0.12) 1px, transparent 1px)
          `,
          backgroundSize: '28px 28px',
        }}
      />
      <div 
        className="absolute inset-0 opacity-10 mix-blend-screen"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 3px)'
        }}
      />
      <motion.div
        className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-cyber-cyan/20 to-transparent"
        animate={{ y: ['-20%', '120%'] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
      />
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyber-cyan rounded-full"
          style={{ left: `${(i * 73) % 100}%`, top: `${(i * 37) % 100}%` }}
          animate={{ y: [0, -12, 0], opacity: [0, 0.9, 0] }}
          transition={{ duration: 2 + (i % 5) * 0.2, repeat: Infinity, delay: (i % 10) * 0.1 }}
        />
      ))}
    </div>
  )
}

export default ScanOverlay


