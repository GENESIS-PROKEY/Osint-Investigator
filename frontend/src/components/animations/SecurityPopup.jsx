import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScanOverlay from './ScanOverlay'
import ModalFrame from '../ui/ModalFrame'

const SecurityPopup = ({ 
  isOpen, 
  onComplete, 
  type = 'login', // 'login' or 'register'
  onClose 
}) => {
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [result, setResult] = useState(null) // true | false | null

  const phases = [
    'INITIALIZING SECURITY PROTOCOL...',
    'SCANNING CREDENTIALS...',
    'VALIDATING USER DATA...',
    'ESTABLISHING SECURE CONNECTION TO DATABASES...',
    'FINGERPRINT AUTHENTICATION...'
  ]

  useEffect(() => {
    if (!isOpen) return
    setPhaseIndex(0)
    setResult(null)

    const stepTimes = [700, 700, 800, 900]
    let t = 0
    const timers = stepTimes.map((ms, i) => setTimeout(() => setPhaseIndex(i + 1), t += ms))

    const final = setTimeout(() => {
      setPhaseIndex(phases.length - 1)
      setTimeout(() => setResult(true), 900)
      setTimeout(() => { onComplete?.(true); onClose?.() }, 2200)
    }, t + 1500)

    return () => { timers.forEach(clearTimeout); clearTimeout(final) }
  }, [isOpen, onComplete, onClose])

  const handleError = () => {
    setResult(false)
    setTimeout(() => { onComplete?.(false); onClose?.() }, 2000)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/80" />
        <ScanOverlay intensity={1} />
        <motion.div
          className="relative w-full max-w-xl mx-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.94, opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <ModalFrame className="p-8">
            <div className="font-mono text-sm text-cyber-cyan mb-4">
              SECURITY CHECKPOINT
            </div>
            <div className="space-y-2 min-h-[100px]">
              {phases.map((p, i) => (
                <motion.div
                  key={p}
                  className={`font-mono ${i <= phaseIndex ? 'text-cyber-cyan' : 'text-cyber-gray'}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: i <= phaseIndex ? 1 : 0.4, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  {i < phaseIndex ? '▸' : '·'} {p}
                </motion.div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-center">
              <motion.div
                className="w-28 h-28 rounded-full border-2 border-cyber-cyan/60"
                animate={{
                  boxShadow: ['0 0 0px #19FFD6', '0 0 24px #19FFD6', '0 0 0px #19FFD6'],
                }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            </div>

            <AnimatePresence>
              {result !== null && (
                <motion.div
                  className="mt-8 text-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                >
                  <div className={`text-2xl font-bold ${result ? 'text-green-400' : 'text-red-400'}`}>
                    {result ? 'ACCESS GRANTED' : 'ACCESS DENIED'}
                  </div>
                  <div className="font-mono text-cyber-cyan text-xs mt-1">
                    {result ? 'WELCOME, AGENT' : 'UNAUTHORIZED ATTEMPT LOGGED'}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </ModalFrame>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default SecurityPopup
