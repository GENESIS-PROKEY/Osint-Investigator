import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../utils/api'

const Dashboard = () => {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await auth.me()
        setUserData(response.data)
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
      <div className="min-h-screen bg-cyber-darker flex items-center justify-center">
        <p className="text-cyber-cyan animate-pulse">LOADING...</p>
      </div>
    )
  }

  if (!userData) {
    return null
  }

  return (
    <div className="min-h-screen bg-cyber-darker p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-cyber-cyan">DASHBOARD</h1>
          <div className="flex gap-4">
            <Link to="/search" className="btn-cyber">
              NEW SEARCH
            </Link>
            <button onClick={handleLogout} className="btn-cyber">
              LOGOUT
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="cyber-border p-6 bg-cyber-dark-gray">
            <h3 className="text-cyber-gray text-sm uppercase mb-2">Plan</h3>
            <p className="text-3xl font-bold text-cyber-cyan capitalize">
              {userData.plan_type}
            </p>
          </div>
          
          <div className="cyber-border p-6 bg-cyber-dark-gray">
            <h3 className="text-cyber-gray text-sm uppercase mb-2">Searches</h3>
            <p className="text-3xl font-bold text-cyber-orange">
              {userData.searches_remaining}
            </p>
          </div>
          
          <div className="cyber-border p-6 bg-cyber-dark-gray">
            <h3 className="text-cyber-gray text-sm uppercase mb-2">Email</h3>
            <p className="text-lg font-bold text-cyber-cyan break-all">
              {userData.email}
            </p>
          </div>
        </div>
        
        <div className="cyber-border p-6 bg-cyber-dark-gray">
          <h2 className="text-2xl font-bold text-cyber-cyan mb-4">Recent Searches</h2>
          <p className="text-cyber-gray">No searches yet. Start your first search!</p>
        </div>
        
        <div className="text-center">
          <Link to="/pricing" className="text-cyber-orange hover:text-cyber-cyan">
            Upgrade your plan →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
