import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { admin } from '../../utils/api'

const TeamManagement = ({ isOpen, onClose }) => {
  const [teams, setTeams] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingTeam, setEditingTeam] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    plan_type: 'enterprise_basic',
    total_searches: 100,
    limit_allocation: 'shared',
    admin_user_id: ''
  })

  useEffect(() => {
    if (isOpen) {
      fetchData()
    }
  }, [isOpen])

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      const [teamsRes, usersRes] = await Promise.all([
        admin.getTeams(),
        admin.getUsers()
      ])
      setTeams(teamsRes.data.teams || [])
      setUsers(usersRes.data.users || [])
    } catch (err) {
      setError('Failed to load data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTeam = async (e) => {
    e.preventDefault()
    try {
      await admin.createTeam(
        formData.name,
        formData.plan_type,
        formData.total_searches,
        formData.limit_allocation,
        parseInt(formData.admin_user_id)
      )
      setShowCreateForm(false)
      setFormData({
        name: '',
        plan_type: 'enterprise_basic',
        total_searches: 100,
        limit_allocation: 'shared',
        admin_user_id: ''
      })
      fetchData()
    } catch (err) {
      setError('Failed to create team')
    }
  }

  const handleUpdateTeam = async (teamId, updates) => {
    try {
      await admin.updateTeam(teamId, updates)
      setEditingTeam(null)
      fetchData()
    } catch (err) {
      setError('Failed to update team')
    }
  }

  const handleAddMember = async (teamId, userId) => {
    try {
      await admin.addTeamMember(teamId, userId)
      fetchData()
    } catch (err) {
      setError('Failed to add member')
    }
  }

  const handleRemoveMember = async (teamId, userId) => {
    try {
      await admin.removeTeamMember(teamId, userId)
      fetchData()
    } catch (err) {
      setError('Failed to remove member')
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="cyber-border bg-cyber-dark-gray max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-cyber-cyan">Team Management</h2>
              <button
                onClick={onClose}
                className="text-cyber-gray hover:text-cyber-cyan text-2xl"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 border border-red-500 bg-red-500/10 text-red-400">
                {error}
              </div>
            )}

            <div className="mb-4 flex justify-end">
              <button
                className="btn-cyber"
                onClick={() => setShowCreateForm(!showCreateForm)}
              >
                {showCreateForm ? 'CANCEL' : 'CREATE TEAM'}
              </button>
            </div>

            <AnimatePresence>
              {showCreateForm && (
                <motion.form
                  onSubmit={handleCreateTeam}
                  className="cyber-border p-4 mb-6 bg-black/30"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <h3 className="text-xl font-bold text-cyber-orange mb-4">Create Team</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-cyber-gray text-sm">Team Name</label>
                      <input
                        type="text"
                        className="input-cyber w-full"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-cyber-gray text-sm">Plan Type</label>
                      <select
                        className="input-cyber w-full"
                        value={formData.plan_type}
                        onChange={(e) => setFormData({ ...formData, plan_type: e.target.value })}
                      >
                        <option value="enterprise_basic">Enterprise Basic</option>
                        <option value="enterprise_unlimited">Enterprise Unlimited</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-cyber-gray text-sm">Total Searches</label>
                      <input
                        type="number"
                        className="input-cyber w-full"
                        value={formData.total_searches}
                        onChange={(e) => setFormData({ ...formData, total_searches: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-cyber-gray text-sm">Admin User</label>
                      <select
                        className="input-cyber w-full"
                        value={formData.admin_user_id}
                        onChange={(e) => setFormData({ ...formData, admin_user_id: e.target.value })}
                        required
                      >
                        <option value="">Select Admin</option>
                        {users.map(u => (
                          <option key={u.id} value={u.id}>{u.email}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="btn-cyber mt-4 w-full">
                    CREATE
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {loading ? (
              <div className="text-center py-12">
                <div className="text-cyber-cyan animate-pulse">LOADING...</div>
              </div>
            ) : (
              <div className="space-y-4">
                {teams.map(team => (
                  <motion.div
                    key={team.id}
                    className="cyber-border p-4 bg-black/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-cyber-cyan">{team.name}</h3>
                        <p className="text-cyber-gray text-sm">
                          {team.plan_type} • {team.members_count} members • {team.total_searches} searches
                        </p>
                      </div>
                      <button
                        className="text-cyber-orange hover:text-cyber-cyan"
                        onClick={() => setEditingTeam(editingTeam === team.id ? null : team.id)}
                      >
                        {editingTeam === team.id ? 'CANCEL' : 'EDIT'}
                      </button>
                    </div>
                    {editingTeam === team.id && (
                      <div className="mt-4 space-y-2">
                        <select
                          className="input-cyber w-full text-sm"
                          onChange={(e) => handleUpdateTeam(team.id, { plan_type: e.target.value })}
                        >
                          <option value="enterprise_basic">Enterprise Basic</option>
                          <option value="enterprise_unlimited">Enterprise Unlimited</option>
                        </select>
                        <input
                          type="number"
                          className="input-cyber w-full text-sm"
                          placeholder="Total searches"
                          onBlur={(e) => handleUpdateTeam(team.id, { total_searches: parseInt(e.target.value) })}
                        />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default TeamManagement
