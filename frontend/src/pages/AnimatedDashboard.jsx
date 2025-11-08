import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import CountUp from '../components/ui/CountUp'
import { auth, billing } from '../utils/api'
import GlitchText from '../components/animations/GlitchText'
import { TimelineSkeleton } from '../components/ui/Skeleton'

const AnimatedDashboard = () => {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isGlitching, setIsGlitching] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await auth.me()
        setUserData(response.data)
        
        // Trigger glitch effect on load
        setIsGlitching(true)
        setTimeout(() => setIsGlitching(false), 1000)
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-darker p-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(rgba(25, 255, 214, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(25, 255, 214, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto space-y-8">
          <div className="h-12 bg-cyber-dark-gray animate-pulse w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="cyber-border p-6 bg-cyber-dark-gray/50">
                <div className="h-4 bg-cyber-gray/30 mb-4 w-24 animate-pulse" />
                <div className="h-8 bg-cyber-gray/30 w-20 animate-pulse" />
              </div>
            ))}
          </div>
          <div className="cyber-border p-6 bg-cyber-dark-gray/50">
            <div className="h-8 bg-cyber-gray/30 mb-4 w-48 animate-pulse" />
            <TimelineSkeleton />
          </div>
        </div>
      </div>
    )
  }

  if (!userData) {
    return null
  }

  return (
    <div className="min-h-screen bg-cyber-darker p-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(25, 255, 214, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(25, 255, 214, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          className="flex justify-between items-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <GlitchText className="text-4xl font-bold text-cyber-cyan">
            DASHBOARD
          </GlitchText>
          <div className="flex gap-4">
            <Link to="/search" className="btn-cyber">
              NEW SEARCH
            </Link>
            <motion.button 
              className="btn-cyber"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={async () => {
                const origin = window.location.origin
                const res = await billing.createCheckoutSession('pro', `${origin}/dashboard?success=1`, `${origin}/dashboard?canceled=1`)
                if (res.data?.url) window.location.href = res.data.url
              }}
            >
              UPGRADE PLAN
            </motion.button>
            <motion.button 
              onClick={handleLogout} 
              className="btn-cyber"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              LOGOUT
            </motion.button>
          </div>
        </motion.div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            className="cyber-border p-6 bg-cyber-dark-gray/50 backdrop-blur-sm"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 0 30px rgba(25, 255, 214, 0.2)"
            }}
          >
            <h3 className="text-cyber-gray text-sm uppercase mb-2">Plan</h3>
            <motion.p 
              className="text-3xl font-bold text-cyber-cyan capitalize"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {userData.plan_type}
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="cyber-border p-6 bg-cyber-dark-gray/50 backdrop-blur-sm"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 0 30px rgba(255, 136, 38, 0.2)"
            }}
          >
            <h3 className="text-cyber-gray text-sm uppercase mb-2">Searches</h3>
            <motion.p 
              className="text-3xl font-bold text-cyber-orange"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <CountUp end={userData.searches_remaining} duration={1.2} />
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="cyber-border p-6 bg-cyber-dark-gray/50 backdrop-blur-sm"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 0 30px rgba(25, 255, 214, 0.2)"
            }}
          >
            <h3 className="text-cyber-gray text-sm uppercase mb-2">Email</h3>
            <motion.p 
              className="text-lg font-bold text-cyber-cyan break-all"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              {userData.email}
            </motion.p>
          </motion.div>
        </div>
        
        {/* Recent Searches (Mock Timeline) */}
        <motion.div 
          className="cyber-border p-6 bg-cyber-dark-gray/50 backdrop-blur-sm"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-cyber-cyan mb-4">Recent Searches</h2>
          <div className="space-y-3">
            {[
              { q: 'john.doe', type: 'username', ts: '2m ago' },
              { q: 'alice@sample.com', type: 'email', ts: '12m ago' },
              { q: '+1-555-0123', type: 'phone', ts: '1h ago' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="pl-3 border-l-2 border-cyber-cyan/50"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * idx }}
              >
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    <span className="text-cyber-cyan uppercase text-xs mr-2">{item.type}</span>
                    {item.q}
                  </div>
                  <div className="text-cyber-gray text-xs">{item.ts}</div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link 
              to="/search" 
              className="inline-block text-cyber-cyan hover:text-cyber-orange transition-colors"
            >
              Begin New Search →
            </Link>
          </div>
        </motion.div>
        
        {/* Upgrade CTA */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <Link 
            to="/pricing" 
            className="text-cyber-orange hover:text-cyber-cyan transition-colors"
          >
            Upgrade your plan →
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default AnimatedDashboard
