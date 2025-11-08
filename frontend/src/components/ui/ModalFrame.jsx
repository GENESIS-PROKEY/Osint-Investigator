import React from 'react'

const ModalFrame = ({ children, className = '' }) => {
  return (
    <div className={`relative bg-cyber-dark-gray/80 backdrop-blur-lg border border-cyber-cyan/40 shadow-[0_0_40px_rgba(25,255,214,0.15)] ${className}`}>
      <div className="absolute -inset-px rounded-none pointer-events-none" style={{
        background: 'linear-gradient(135deg, rgba(25,255,214,0.6), rgba(255,136,38,0.6))',
        mask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
        WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
        maskComposite: 'exclude', WebkitMaskComposite: 'xor', padding: 1
      }} />
      {children}
    </div>
  )
}

export default ModalFrame


