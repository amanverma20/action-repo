import React from 'react'
import { GitBranch, GitPullRequest, GitMerge } from 'lucide-react'

interface EventFilterProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
  eventCounts: { push: number; pull_request: number; merge: number }
}

export const EventFilter: React.FC<EventFilterProps> = ({ 
  activeFilter, 
  onFilterChange, 
  eventCounts 
}) => {
  const filters = [
    { key: 'all', label: 'All Events', icon: null, count: eventCounts.push + eventCounts.pull_request + eventCounts.merge },
    { key: 'push', label: 'Push', icon: GitBranch, count: eventCounts.push, color: 'text-blue-400' },
    { key: 'pull_request', label: 'Pull Request', icon: GitPullRequest, count: eventCounts.pull_request, color: 'text-green-400' },
    { key: 'merge', label: 'Merge', icon: GitMerge, count: eventCounts.merge, color: 'text-purple-400' }
  ]

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter) => {
        const Icon = filter.icon
        const isActive = activeFilter === filter.key
        
        return (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
              isActive 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600'
            }`}
          >
            {Icon && <Icon className={`w-4 h-4 ${filter.color || 'text-gray-400'}`} />}
            <span className="text-sm font-medium">{filter.label}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              isActive 
                ? 'bg-gray-600 text-gray-200' 
                : 'bg-gray-700 text-gray-400'
            }`}>
              {filter.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}