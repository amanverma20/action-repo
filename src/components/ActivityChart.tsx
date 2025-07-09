import React, { useMemo } from 'react'
import { BarChart3 } from 'lucide-react'
import { GitHubEvent } from '../lib/supabase'

interface ActivityChartProps {
  events: GitHubEvent[]
}

export const ActivityChart: React.FC<ActivityChartProps> = ({ events }) => {
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split('T')[0]
    }).reverse()

    return last7Days.map(date => {
      const dayEvents = events.filter(event => 
        event.timestamp.split('T')[0] === date
      )
      
      return {
        date,
        total: dayEvents.length,
        push: dayEvents.filter(e => e.action_type === 'push').length,
        pull_request: dayEvents.filter(e => e.action_type === 'pull_request').length,
        merge: dayEvents.filter(e => e.action_type === 'merge').length,
        label: new Date(date).toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      }
    })
  }, [events])

  const maxEvents = Math.max(...chartData.map(d => d.total), 1)

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5" />
        Activity Over Last 7 Days
      </h3>
      <div className="space-y-4">
        {chartData.map((day) => (
          <div key={day.date} className="flex items-center gap-3">
            <div className="w-16 text-xs text-gray-400 text-right">
              {day.label}
            </div>
            <div className="flex-1 flex items-center gap-1">
              <div className="flex-1 bg-gray-700 rounded-full h-6 overflow-hidden">
                <div className="h-full flex">
                  {day.push > 0 && (
                    <div 
                      className="bg-blue-500 h-full"
                      style={{ width: `${(day.push / maxEvents) * 100}%` }}
                      title={`${day.push} pushes`}
                    />
                  )}
                  {day.pull_request > 0 && (
                    <div 
                      className="bg-green-500 h-full"
                      style={{ width: `${(day.pull_request / maxEvents) * 100}%` }}
                      title={`${day.pull_request} pull requests`}
                    />
                  )}
                  {day.merge > 0 && (
                    <div 
                      className="bg-purple-500 h-full"
                      style={{ width: `${(day.merge / maxEvents) * 100}%` }}
                      title={`${day.merge} merges`}
                    />
                  )}
                </div>
              </div>
              <div className="w-8 text-xs text-gray-300 text-center">
                {day.total}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-gray-400">Push</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-gray-400">Pull Request</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 bg-purple-500 rounded"></div>
          <span className="text-gray-400">Merge</span>
        </div>
      </div>
    </div>
  )
}