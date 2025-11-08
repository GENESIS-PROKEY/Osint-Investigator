import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const EnhancedLanding = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const ctaRef = useRef(null)
  
  const heroInView = useInView(heroRef, { once: true })
  const featuresInView = useInView(featuresRef, { once: true })
  const ctaInView = useInView(ctaRef, { once: true })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const features = [
    {
      icon: "🔍",
      title: "MULTI-SOURCE SEARCH",
      description: "Search across emails, phones, usernames, vehicles, and UPI IDs"
    },
    {
      icon: "⚡",
      title: "INSTANT RESULTS",
      description: "Lightning-fast searches powered by advanced indexing"
    },
    {
      icon: "🔒",
      title: "SECURE & PRIVATE",
      description: "Your searches are encrypted and completely confidential"
    },
    {
      icon: "🛡️",
      title: "VERIFIED DATA",
      description: "Access to verified OSINT data from multiple sources"
    }
  ]

  return (
    <div className="min-h-screen bg-cyber-darker relative overflow-hidden">
      {/* Animated Background Grid */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(25, 255, 214, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(25, 255, 214, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
        }}
      />
      
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyber-cyan rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header 
        className="relative z-10 flex justify-between items-center p-8"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-2 border-cyber-cyan rounded-full flex items-center justify-center">
            <span className="text-cyber-cyan text-sm font-bold">O</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wider">OSINT INVESTIGATOR</h1>
        </div>
        
        <div className="flex space-x-4">
          <Link 
            to="/login" 
            className="px-6 py-2 bg-cyber-cyan text-cyber-darker font-bold hover:bg-cyber-cyan/80 transition-all duration-300"
          >
            LOGIN
          </Link>
          <Link 
            to="/register" 
            className="px-6 py-2 border-2 border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-darker transition-all duration-300"
          >
            GET STARTED
          </Link>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        className="relative z-10 text-center px-8 py-20"
        initial={{ opacity: 0 }}
        animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h1 
          className="text-6xl md:text-8xl font-bold text-white mb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={heroInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <span className="bg-gradient-to-r from-cyber-cyan to-cyber-orange bg-clip-text text-transparent">
            OPEN SOURCE
          </span>
          <br />
          <span className="text-white">INTELLIGENCE</span>
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto"
          initial={{ y: 30, opacity: 0 }}
          animate={heroInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          Advanced OSINT investigations across multiple data sources. Search emails, usernames, phone numbers, vehicles, and more.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8"
          initial={{ y: 30, opacity: 0 }}
          animate={heroInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <Link 
            to="/register" 
            className="px-8 py-4 bg-cyber-cyan text-cyber-darker font-bold text-lg hover:bg-cyber-cyan/80 transition-all duration-300 transform hover:scale-105"
          >
            START FREE SEARCH
          </Link>
          <Link 
            to="/login" 
            className="px-8 py-4 border-2 border-cyber-cyan text-cyber-cyan font-bold text-lg hover:bg-cyber-cyan hover:text-cyber-darker transition-all duration-300 transform hover:scale-105"
          >
            LOGIN
          </Link>
        </motion.div>
        
        <motion.p 
          className="text-cyber-cyan text-lg"
          initial={{ opacity: 0 }}
          animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          • 1 FREE SEARCH FOR NEW USERS
        </motion.p>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        ref={featuresRef}
        className="relative z-10 px-8 py-20"
        initial={{ opacity: 0 }}
        animate={featuresInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="border-2 border-cyber-cyan p-6 bg-cyber-dark-gray/50 backdrop-blur-sm hover:bg-cyber-dark-gray/70 transition-all duration-300 group"
              initial={{ y: 50, opacity: 0 }}
              animate={featuresInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 30px rgba(25, 255, 214, 0.3)"
              }}
            >
              <motion.div 
                className="text-4xl mb-4"
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyber-cyan transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-300 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Call to Action Section */}
      <motion.section 
        ref={ctaRef}
        className="relative z-10 px-8 py-20"
        initial={{ opacity: 0 }}
        animate={ctaInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.div 
          className="max-w-4xl mx-auto text-center border-2 border-cyber-cyan p-12 bg-cyber-dark-gray/50 backdrop-blur-sm"
          initial={{ y: 50, opacity: 0 }}
          animate={ctaInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          whileHover={{ 
            boxShadow: "0 0 40px rgba(25, 255, 214, 0.2)"
          }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            READY TO INVESTIGATE?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Register now and get your first search free. Minimal subscription fee for unlimited access.
          </p>
          <Link 
            to="/register" 
            className="inline-block px-12 py-4 bg-cyber-cyan text-cyber-darker font-bold text-xl hover:bg-cyber-cyan/80 transition-all duration-300 transform hover:scale-105"
          >
            CREATE ACCOUNT
          </Link>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        className="relative z-10 text-center py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <p className="text-gray-500 text-sm">
          • 2025 OSINT INVESTIGATOR. ALL RIGHTS RESERVED
        </p>
      </motion.footer>
    </div>
  )
}

export default EnhancedLanding
