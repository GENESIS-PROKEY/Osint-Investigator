import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const CircuitPuzzle = ({ 
  onComplete = () => {},
  challenge = null 
}) => {
  const [connections, setConnections] = useState([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const nodes = challenge?.nodes || [
    { id: 'lightning', x: 50, y: 20, label: '⚡' },
    { id: 'connector1', x: 30, y: 50, label: '●' },
    { id: 'connector2', x: 50, y: 50, label: '●' },
    { id: 'connector3', x: 70, y: 50, label: '●' },
    { id: 'lock', x: 50, y: 80, label: '🔒' }
  ]

  const connectionPaths = challenge?.connections || [
    { from: 'lightning', to: 'connector1', type: 'L' },
    { from: 'connector1', to: 'connector2', type: 'T' },
    { from: 'connector2', to: 'connector3', type: 'T' },
    { from: 'connector3', to: 'lock', type: 'L' }
  ]

  const startAnimation = () => {
    if (isAnimating || isComplete) return

    setIsAnimating(true)
    setCurrentStep(0)

    // Animate each connection step by step
    connectionPaths.forEach((path, index) => {
      setTimeout(() => {
        setConnections(prev => [...prev, path])
        setCurrentStep(index + 1)
        
        if (index === connectionPaths.length - 1) {
          setTimeout(() => {
            setIsAnimating(false)
            setIsComplete(true)
            onComplete()
          }, 1000)
        }
      }, (index + 1) * 800)
    })
  }

  const getConnectionStyle = (path) => {
    const fromNode = nodes.find(n => n.id === path.from)
    const toNode = nodes.find(n => n.id === path.to)
    
    if (!fromNode || !toNode) return {}

    const x1 = fromNode.x
    const y1 = fromNode.y
    const x2 = toNode.x
    const y2 = toNode.y

    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI

    return {
      position: 'absolute',
      left: `${x1}%`,
      top: `${y1}%`,
      width: `${length}%`,
      height: '2px',
      background: 'linear-gradient(90deg, #19FFD6, #FF8826)',
      transformOrigin: '0 50%',
      transform: `rotate(${angle}deg)`,
      boxShadow: '0 0 10px #19FFD6'
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-cyber-cyan mb-2">
          CIRCUIT CONNECTION
        </h3>
        <p className="text-gray-300 text-sm">
          Establish secure connection path
        </p>
      </div>

      {/* Circuit Diagram */}
      <div className="relative w-full h-64 bg-cyber-dark-gray border-2 border-cyber-cyan mb-6">
        {/* Nodes */}
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-cyber-cyan font-bold"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            animate={isAnimating ? {
              scale: [1, 1.2, 1],
              boxShadow: ["0 0 0px #19FFD6", "0 0 20px #19FFD6", "0 0 0px #19FFD6"]
            } : {}}
            transition={{ 
              duration: 0.5, 
              repeat: isAnimating ? Infinity : 0,
              delay: node.id === 'lightning' ? 0 : 0.2
            }}
          >
            {node.label}
          </motion.div>
        ))}

        {/* Connections */}
        {connections.map((path, index) => (
          <motion.div
            key={`${path.from}-${path.to}`}
            style={getConnectionStyle(path)}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          />
        ))}
      </div>

      {/* Start Button */}
      {!isAnimating && !isComplete && (
        <motion.button
          className="w-full py-3 bg-cyber-cyan text-cyber-darker font-bold hover:bg-cyber-cyan/80 transition-all"
          onClick={startAnimation}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          ESTABLISH CONNECTION
        </motion.button>
      )}

      {/* Animating State */}
      {isAnimating && (
        <div className="text-center">
          <motion.div
            className="text-cyber-cyan font-mono mb-4"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            CONNECTING... {currentStep}/{connectionPaths.length}
          </motion.div>
          
          <div className="w-full h-2 bg-cyber-dark-gray border border-cyber-cyan overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-orange"
              animate={{ width: `${(currentStep / connectionPaths.length) * 100}%` }}
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
          <div className="text-4xl text-green-400 mb-2">🔓</div>
          <div className="text-cyber-cyan font-bold">CONNECTION ESTABLISHED</div>
        </motion.div>
      )}
    </div>
  )
}

export default CircuitPuzzle
