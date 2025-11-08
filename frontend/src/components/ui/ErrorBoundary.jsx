import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // Optional: Report to Sentry if configured
    if (window.Sentry && typeof window.Sentry.captureException === 'function') {
      window.Sentry.captureException(error, { extra: info })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-cyber-darker text-center p-6">
          <div className="cyber-border p-8 bg-cyber-dark-gray/70">
            <div className="text-2xl font-bold text-cyber-cyan mb-2">Something went wrong</div>
            <div className="text-cyber-gray mb-4">Please refresh the page or try again later.</div>
            <button className="btn-cyber" onClick={() => window.location.reload()}>Reload</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary


