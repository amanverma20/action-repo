import React from 'react'
import { GitBranch, GitPullRequest, GitMerge, Activity } from 'lucide-react'
import { GitHubEvent } from '../lib/supabase'

interface EventStatsProps {
  events: GitHubEvent[]
}

export const EventStats: React.FC<EventStatsProps> = ({ events }) => {
  const stats = {
    total: events.length,
    push: events.filter(e => e.action_type === 'push').length,
    pull_request: events.filter(e => e.action_type === 'pull_request').length,
    merge: events.filter(e => e.action_type === 'merge').length,
    repositories: new Set(events.map(e => e.repository)).size,
    authors: new Set(events.map(e => e.author)).size
  }

  const statCards = [
    {
      label: 'Total Events',
      value: stats.total,
      icon: Activity,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      label: 'Push Events',
      value: stats.push,
      icon: GitBranch,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      label: 'Pull Requests',
      value: stats.pull_request,
      icon: GitPullRequest,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      label: 'Merges',
      value: stats.merge,
      icon: GitMerge,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20'
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className={`${stat.bgColor} ${stat.borderColor} border rounded-lg p-4 transition-all duration-200 hover:scale-105`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <Icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </div>
        )
      })}
    </div>
  )
}