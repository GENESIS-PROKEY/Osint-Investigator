import React, { useState, useEffect } from 'react'
import { admin } from '../utils/api'
import TeamManagement from '../components/admin/TeamManagement'

const AdminPanel = () => {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [jobId, setJobId] = useState('')
  const [jobStatus, setJobStatus] = useState({})
  const [showTeams, setShowTeams] = useState(false)

  const startUpload = async () => {
    if (!file) return
    setUploading(true)
    try {
      const res = await admin.uploadData(file)
      if (res.data?.job_id) {
        setJobId(res.data.job_id)
      }
    } finally {
      setUploading(false)
    }
  }

  useEffect(() => {
    if (!jobId) return
    const t = setInterval(async () => {
      try {
        const res = await admin.getAnalytics() // placeholder to keep token fresh
      } catch {}
      try {
        const statusRes = await fetch(`/admin/upload-status?job_id=${jobId}`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }})
        if (statusRes.ok) {
          const data = await statusRes.json()
          setJobStatus(data)
          if (data.status === 'completed' || data.status === 'failed') {
            clearInterval(t)
          }
        }
      } catch {}
    }, 1500)
    return () => clearInterval(t)
  }, [jobId])

  return (
    <div className="min-h-screen bg-cyber-darker p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-cyber-cyan mb-8">ADMIN PANEL</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="cyber-border p-6 bg-cyber-dark-gray">
            <h3 className="text-xl font-bold text-cyber-orange mb-4">Data Management</h3>
            <p className="text-cyber-gray mb-4">Upload Excel/CSV files or bulk JSON imports</p>
            <input type="file" accept=".xlsx,.xls,.csv" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mb-3" />
            <button className="btn-cyber" onClick={startUpload} disabled={!file || uploading}>
              {uploading ? 'UPLOADING...' : 'UPLOAD DATA'}
            </button>
            {jobId && (
              <div className="mt-4 text-cyber-gray text-sm">
                Job: {jobId} — {jobStatus.status} ({jobStatus.processed || 0}/{jobStatus.total || 0})
              </div>
            )}
          </div>
          
          <div className="cyber-border p-6 bg-cyber-dark-gray">
            <h3 className="text-xl font-bold text-cyber-orange mb-4">User Management</h3>
            <p className="text-cyber-gray mb-4">Manage users, plans, and access</p>
            <button className="btn-cyber">MANAGE USERS</button>
          </div>
          
          <div className="cyber-border p-6 bg-cyber-dark-gray">
            <h3 className="text-xl font-bold text-cyber-orange mb-4">Team Management</h3>
            <p className="text-cyber-gray mb-4">Configure enterprise teams and limits</p>
            <button className="btn-cyber" onClick={() => setShowTeams(true)}>MANAGE TEAMS</button>
          </div>
          
          <div className="cyber-border p-6 bg-cyber-dark-gray">
            <h3 className="text-xl font-bold text-cyber-orange mb-4">Analytics</h3>
            <p className="text-cyber-gray mb-4">View usage statistics and trends</p>
            <button className="btn-cyber">VIEW ANALYTICS</button>
          </div>
        </div>
      </div>
      <TeamManagement isOpen={showTeams} onClose={() => setShowTeams(false)} />
    </div>
  )
}

export default AdminPanel
