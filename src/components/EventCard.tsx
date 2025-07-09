import React from 'react'
import { GitBranch, GitPullRequest, GitMerge, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { GitHubEvent } from '../lib/supabase'

interface EventCardProps {
  event: GitHubEvent
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const getEventIcon = () => {
    switch (event.action_type) {
      case 'push':
        return <GitBranch className="w-5 h-5 text-blue-400" />
      case 'pull_request':
        return <GitPullRequest className="w-5 h-5 text-green-400" />
      case 'merge':
        return <GitMerge className="w-5 h-5 text-purple-400" />
      default:
        return <GitBranch className="w-5 h-5 text-gray-400" />
    }
  }

  const getEventColor = () => {
    switch (event.action_type) {
      case 'push':
        return 'border-blue-500/20 bg-blue-500/5'
      case 'pull_request':
        return 'border-green-500/20 bg-green-500/5'
      case 'merge':
        return 'border-purple-500/20 bg-purple-500/5'
      default:
        return 'border-gray-500/20 bg-gray-500/5'
    }
  }

  const formatMessage = () => {
    const timestamp = new Date(event.timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })

    switch (event.action_type) {
      case 'push':
        return `${event.author} pushed to ${event.to_branch} on ${timestamp}`
      case 'pull_request':
        return `${event.author} submitted a pull request from ${event.from_branch} to ${event.to_branch} on ${timestamp}`
      case 'merge':
        return `${event.author} merged branch ${event.from_branch} to ${event.to_branch} on ${timestamp}`
      default:
        return `${event.author} performed an action on ${timestamp}`
    }
  }

  return (
    <div className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-lg ${getEventColor()}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          {getEventIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-gray-200 text-sm leading-relaxed">
            {formatMessage()}
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            <span>{formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}</span>
            <span>•</span>
            <span className="font-mono">{event.repository}</span>
          </div>
        </div>
      </div>
    </div>
  )
}