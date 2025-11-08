import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { auth } from '../utils/api'
import GlitchText from '../components/animations/GlitchText'
import SecurityPopup from '../components/animations/SecurityPopup'
import Toast from '../components/ui/Toast'

const AnimatedLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSecurityPopup, setShowSecurityPopup] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    setError('')
    setLoading(true)
    setShowSecurityPopup(true)
  }

  const handleSecurityComplete = (success) => {
    setShowSecurityPopup(false)
    if (success) {
      // Mock successful login
      localStorage.setItem('token', 'mock_token_123')
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        email: email,
        plan: 'free',
        searches_remaining: 10
      }))
      navigate('/dashboard')
    } else {
      setError('Authentication failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-darker px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(25, 255, 214, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(25, 255, 214, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      <motion.div 
        className="cyber-border max-w-md w-full p-8 bg-cyber-dark-gray relative z-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <GlitchText className="text-3xl font-bold text-cyber-cyan mb-2">
            ACCESS DENIED
          </GlitchText>
        </div>

        {/* Login Form */}
        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {error && <Toast type="error">{error}</Toast>}
          
          <div>
            <label className="block text-cyber-gray mb-2">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-cyber w-full"
              placeholder="user@example.com"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-cyber-gray mb-2">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-cyber w-full"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>
          
          <motion.button 
            type="submit" 
            className="btn-cyber w-full" 
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
          </motion.button>
        </motion.form>
        
        <p className="text-center text-cyber-gray mt-6">
          Don't have an account? <Link to="/register" className="text-cyber-cyan hover:text-cyber-orange">Register</Link>
        </p>
      </motion.div>

      {/* Security Popup */}
      <SecurityPopup
        isOpen={showSecurityPopup}
        onComplete={handleSecurityComplete}
        onClose={() => setShowSecurityPopup(false)}
        type="login"
      />
    </div>
  )
}

export default AnimatedLogin
