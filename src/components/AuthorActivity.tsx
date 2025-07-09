import React from 'react'
import { User, TrendingUp } from 'lucide-react'
import { GitHubEvent } from '../lib/supabase'

interface AuthorActivityProps {
  events: GitHubEvent[]
}

export const AuthorActivity: React.FC<AuthorActivityProps> = ({ events }) => {
  const authorStats = events.reduce((acc, event) => {
    const author = event.author
    if (!acc[author]) {
      acc[author] = {
        name: author,
        push: 0,
        pull_request: 0,
        merge: 0,
        total: 0,
        repositories: new Set()
      }
    }
    acc[author][event.action_type]++
    acc[author].total++
    acc[author].repositories.add(event.repository)
    return acc
  }, {} as Record<string, { name: string; push: number; pull_request: number; merge: number; total: number; repositories: Set<string> }>)

  const authors = Object.values(authorStats)
    .sort((a, b) => b.total - a.total)
    .slice(0, 10) // Top 10 most active authors

  if (authors.length === 0) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          Top Contributors
        </h3>
        <p className="text-gray-400 text-center">No contributors found</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5" />
        Top Contributors ({authors.length})
      </h3>
      <div className="space-y-3">
        {authors.map((author, index) => (
          <div
            key={author.name}
            className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {index + 1}
              </div>
              <div>
                <h4 className="font-medium text-white">{author.name}</h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                  <span className="text-blue-400">{author.push} pushes</span>
                  <span className="text-green-400">{author.pull_request} PRs</span>
                  <span className="text-purple-400">{author.merge} merges</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-white">{author.total}</div>
              <div className="text-xs text-gray-400">{author.repositories.size} repos</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}