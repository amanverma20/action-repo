import React from 'react'
import { Folder, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { GitHubEvent } from '../lib/supabase'

interface RepositoryListProps {
  events: GitHubEvent[]
}

export const RepositoryList: React.FC<RepositoryListProps> = ({ events }) => {
  const repositoryStats = events.reduce((acc, event) => {
    const repo = event.repository
    if (!acc[repo]) {
      acc[repo] = {
        name: repo,
        eventCount: 0,
        lastActivity: event.timestamp,
        authors: new Set()
      }
    }
    acc[repo].eventCount++
    acc[repo].authors.add(event.author)
    if (new Date(event.timestamp) > new Date(acc[repo].lastActivity)) {
      acc[repo].lastActivity = event.timestamp
    }
    return acc
  }, {} as Record<string, { name: string; eventCount: number; lastActivity: string; authors: Set<string> }>)

  const repositories = Object.values(repositoryStats)
    .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())

  if (repositories.length === 0) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Folder className="w-5 h-5" />
          Active Repositories
        </h3>
        <p className="text-gray-400 text-center">No repositories found</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Folder className="w-5 h-5" />
        Active Repositories ({repositories.length})
      </h3>
      <div className="space-y-3">
        {repositories.map((repo) => (
          <div
            key={repo.name}
            className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <div className="flex-1">
              <h4 className="font-medium text-white">{repo.name}</h4>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                <span>{repo.eventCount} events</span>
                <span>•</span>
                <span>{repo.authors.size} contributors</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{formatDistanceToNow(new Date(repo.lastActivity), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}