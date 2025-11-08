import React, { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const steps = [
  'CONNECTING TO NODE...',
  'HANDSHAKE...',
  'ENCRYPTING CHANNEL...',
  'INDEXING DATASETS...',
  'READY.'
]

const ConnectionSequence = ({ onComplete = () => {}, durationPerStep = 700 }) => {
  const [stepIndex, setStepIndex] = useState(0)
  const canvasRef = useRef(null)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (prefersReduced) return
    const ctx = canvasRef.current?.getContext('2d')
    let raf
    let t = 0

    const draw = () => {
      if (!ctx) return
      if (document.visibilityState !== 'visible') {
        raf = requestAnimationFrame(draw)
        return
      }
      const { width, height } = canvasRef.current
      ctx.clearRect(0, 0, width, height)

      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, width, height)
      ctx.strokeStyle = 'rgba(25,255,214,0.15)'
      for (let x = 0; x < width; x += 28) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke() }
      for (let y = 0; y < height; y += 28) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke() }

      const nodes = [
        { x: width * 0.2, y: height * 0.5 },
        { x: width * 0.5, y: height * 0.3 },
        { x: width * 0.8, y: height * 0.5 },
      ]
      nodes.forEach((n, i) => {
        const pulse = 0.6 + 0.4 * Math.sin(t * 0.06 + i)
        ctx.beginPath()
        ctx.arc(n.x, n.y, 8 + pulse * 3, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(25,255,214,0.6)'
        ctx.fill()
      })

      const progress = (t % 200) / 200
      const path = [nodes[0], nodes[1], nodes[2]]
      ctx.lineWidth = 3
      ctx.strokeStyle = 'rgba(25,255,214,0.8)'
      ctx.beginPath()
      ctx.moveTo(path[0].x, path[0].y)
      const midX = path[1].x
      const targetX = path[0].x + (path[2].x - path[0].x) * progress
      const targetY = path[0].y + (path[2].y - path[0].y) * progress
      ctx.lineTo(Math.min(targetX, midX), path[0].y + (path[1].y - path[0].y) * Math.min(progress * 2, 1))
      if (progress > 0.5) ctx.lineTo(targetX, targetY)
      ctx.stroke()

      t += 1
      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [prefersReduced])

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((i) => {
        const next = i + 1
        if (next >= steps.length) {
          clearInterval(timer)
          setTimeout(onComplete, 400)
          return i
        }
        return next
      })
    }, durationPerStep)
    return () => clearInterval(timer)
  }, [onComplete, durationPerStep])

  return (
    <div className="w-full">
      <div className="relative w-full h-52 border border-cyber-cyan/40 bg-black">
        {!prefersReduced && (
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" width={800} height={220} />
        )}
        <motion.div 
          className="absolute bottom-2 left-2 font-mono text-xs text-cyber-cyan"
          key={stepIndex}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {steps[stepIndex]}
        </motion.div>
      </div>
    </div>
  )
}

export default ConnectionSequence


