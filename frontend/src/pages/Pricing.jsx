import React from 'react'
import { motion } from 'framer-motion'
import { billing } from '../utils/api'

const Pricing = () => {
  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: 'forever',
      searches: '10/month',
      features: ['Basic search', 'Limited results', 'Community support']
    },
    {
      name: 'Pro',
      price: '₹2,000',
      period: 'per year',
      searches: '10/day',
      features: ['Advanced search', 'All data types', 'Email support', 'Dashboard']
    },
    {
      name: 'Investigator',
      price: '₹5,000',
      period: 'per year',
      searches: '50/day',
      features: ['Priority search', 'Advanced analytics', 'Email support', 'Search history']
    },
    {
      name: 'Enterprise Basic',
      price: '₹10,000',
      period: 'per year',
      searches: 'Shared team limit',
      features: ['Multi-user access', 'Team management', 'Private datasets', 'Priority support']
    },
    {
      name: 'Enterprise Unlimited',
      price: 'Custom',
      period: 'contact us',
      searches: 'Unlimited',
      features: ['Unlimited users', 'Custom allocation', 'Dedicated support', 'Private hosting']
    }
  ]

  return (
    <div className="min-h-screen bg-cyber-darker p-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `linear-gradient(rgba(25,255,214,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(25,255,214,0.1) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.h1 
          className="text-5xl font-bold text-cyber-cyan text-center mb-12"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          PRICING PLANS
        </motion.h1>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {plans.map((plan, index) => (
            <motion.div 
              key={plan.name} 
              className="cyber-border p-6 bg-cyber-dark-gray/70 backdrop-blur-sm hover:shadow-[0_0_30px_rgba(25,255,214,0.15)] transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ scale: 1.03 }}
            >
              <h3 className="text-2xl font-bold text-cyber-orange mb-2">{plan.name}</h3>
              <div className="mb-4 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-cyber-cyan">{plan.price}</span>
                <span className="text-cyber-gray">{plan.period}</span>
              </div>
              
              <p className="text-cyber-gray mb-6">{plan.searches}</p>
              
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="text-cyber-gray text-sm">• {feature}</li>
                ))}
              </ul>
              
              <motion.button 
                className="btn-cyber w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={async () => {
                  if (plan.name === 'Enterprise Unlimited') {
                    window.location.href = '/contact';
                    return;
                  }
                  const map = { 'Pro': 'pro', 'Investigator': 'investigator', 'Enterprise Basic': 'enterprise_basic' }
                  const key = map[plan.name]
                  if (!key) return
                  const origin = window.location.origin
                  const res = await billing.createCheckoutSession(key, `${origin}/pricing?success=1`, `${origin}/pricing?canceled=1`)
                  if (res.data?.url) window.location.href = res.data.url
                }}
              >
                {plan.name === 'Enterprise Unlimited' ? 'CONTACT US' : 'CHOOSE PLAN'}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Guarantees Row */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-cyber-gray">
          <div className="cyber-border p-4 bg-cyber-dark-gray/60">7-day refund</div>
          <div className="cyber-border p-4 bg-cyber-dark-gray/60">99.9% uptime</div>
          <div className="cyber-border p-4 bg-cyber-dark-gray/60">Priority support</div>
        </div>
      </div>
    </div>
  )
}

export default Pricing
