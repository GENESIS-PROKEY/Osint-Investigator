import React from 'react'
import { motion } from 'framer-motion'

const Skeleton = ({ className = '', variant = 'default' }) => {
  const baseClasses = "bg-cyber-dark-gray animate-pulse"
  
  const variants = {
    default: "h-4 w-full",
    text: "h-4 w-3/4",
    title: "h-6 w-2/3",
    card: "h-48 w-full",
    circle: "h-12 w-12 rounded-full"
  }
  
  return (
    <motion.div
      className={`${baseClasses} ${variants[variant]} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
    />
  )
}

export const SearchResultsSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="cyber-border p-6 bg-cyber-dark-gray/50">
        <div className="flex items-center justify-between mb-4">
          <Skeleton variant="title" />
          <Skeleton variant="text" className="w-24" />
        </div>
        <div className="space-y-2">
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      </div>
    ))}
  </div>
)

export const TimelineSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-center p-3 border border-cyber-gray/30">
        <Skeleton variant="circle" className="mr-3" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" />
          <Skeleton />
        </div>
      </div>
    ))}
  </div>
)

export default Skeleton
