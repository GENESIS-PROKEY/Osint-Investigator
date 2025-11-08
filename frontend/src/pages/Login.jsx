import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../utils/api'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await auth.login({ email, password })
      
      // Store token and user data
      localStorage.setItem('token', response.data.access_token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      // Redirect to dashboard
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-darker px-4">
      <div className="cyber-border max-w-md w-full p-8 bg-cyber-dark-gray">
        <h2 className="text-3xl font-bold text-cyber-cyan mb-8 text-center">
          ACCESS DENIED
        </h2>
        
        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500 text-red-500 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
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
          
          <button type="submit" className="btn-cyber w-full" disabled={loading}>
            {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
          </button>
        </form>
        
        <p className="text-center text-cyber-gray mt-6">
          Don't have an account? <Link to="/register" className="text-cyber-cyan hover:text-cyber-orange">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
