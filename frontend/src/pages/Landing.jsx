import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cyber-darker">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-8 px-4"
      >
        <h1 className="text-7xl font-bold text-cyber-cyan animate-pulse-glow">
          OSINT INVESTIGATOR
        </h1>
        
        <p className="text-2xl text-cyber-gray max-w-2xl mx-auto">
          Search across massive datasets with lightning speed. 
          Find emails, phones, usernames, vehicles, and more.
        </p>
        
        <div className="flex gap-6 justify-center mt-12">
          <Link to="/register" className="btn-cyber text-xl">
            GET STARTED
          </Link>
          <Link to="/login" className="btn-cyber text-xl">
            SIGN IN
          </Link>
        </div>
        
        <div className="mt-16 border-t-2 border-cyber-cyan pt-8">
          <Link to="/pricing" className="text-cyber-orange hover:text-cyber-cyan transition-colors">
            View Pricing Plans →
          </Link>
        </div>
      </motion.div>
      
      <div className="absolute bottom-8 text-cyber-dark-cyan text-sm">
        Press ESC to go back
      </div>
    </div>
  )
}

export default Landing
