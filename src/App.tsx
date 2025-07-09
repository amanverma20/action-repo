import React, { useState, useMemo } from 'react'
import { Github, RefreshCw, AlertCircle, BarChart3, Users, Folder, Settings } from 'lucide-react'
import { EventCard } from './components/EventCard'
import { EventFilter } from './components/EventFilter'
import { EventStats } from './components/EventStats'
import { ActivityChart } from './components/ActivityChart'
import { RepositoryList } from './components/RepositoryList'
import { AuthorActivity } from './components/AuthorActivity'
import { WebhookSetup } from './components/WebhookSetup'
import { LoadingSpinner } from './components/LoadingSpinner'
import { useGitHubEvents } from './hooks/useGitHubEvents'

function App() {
  const { events, loading, error, refetch } = useGitHubEvents()
  const [activeFilter, setActiveFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('events')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const filteredEvents = useMemo(() => {
    if (activeFilter === 'all') return events
    return events.filter(event => event.action_type === activeFilter)
  }, [events, activeFilter])

  const eventCounts = useMemo(() => {
    return {
      push: events.filter(e => e.action_type === 'push').length,
      pull_request: events.filter(e => e.action_type === 'pull_request').length,
      merge: events.filter(e => e.action_type === 'merge').length
    }
  }, [events])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetch()
    setTimeout(() => setIsRefreshing(false), 500)
  }

  const tabs = [
    { key: 'events', label: 'Events', icon: Github },
    { key: 'analytics', label: 'Analytics', icon: BarChart3 },
    { key: 'repositories', label: 'Repositories', icon: Folder },
    { key: 'contributors', label: 'Contributors', icon: Users },
    { key: 'setup', label: 'Setup', icon: Settings }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Github className="w-8 h-8 text-gray-300" />
            <div>
              <h1 className="text-2xl font-bold text-white">GitHub Webhook Dashboard</h1>
              <p className="text-gray-400 text-sm">Real-time repository events</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-900/20 border border-red-500/30 rounded-lg mb-6">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-200">{error}</span>
          </div>
        )}

        {/* Stats Overview */}
        <EventStats events={events} />

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-700">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.key
            
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-3 rounded-t-lg border-b-2 transition-all duration-200 ${
                  isActive 
                    ? 'border-blue-500 bg-gray-800 text-white' 
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'events' && (
          <>
            {/* Filters */}
            <EventFilter 
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              eventCounts={eventCounts}
            />

            {/* Events List */}
            <div className="space-y-4">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <Github className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-400 mb-2">No events found</h3>
                  <p className="text-gray-500">
                    {activeFilter === 'all' 
                      ? 'Set up your GitHub webhook to start receiving events'
                      : `No ${activeFilter} events found`
                    }
                  </p>
                </div>
              ) : (
                filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))
              )}
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <ActivityChart events={events} />
          </div>
        )}

        {activeTab === 'repositories' && (
          <div className="space-y-6">
            <RepositoryList events={events} />
          </div>
        )}

        {activeTab === 'contributors' && (
          <div className="space-y-6">
            <AuthorActivity events={events} />
          </div>
        )}

        {activeTab === 'setup' && (
          <div className="space-y-6">
            <WebhookSetup />
          </div>
        )}

        {/* Auto-refresh indicator */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Auto-refreshing every 15 seconds • Last updated: {new Date().toLocaleTimeString()} • {events.length} total events
          </p>
        </div>
      </div>
    </div>
  )
}

export default App