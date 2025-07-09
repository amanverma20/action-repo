import { useState, useEffect } from 'react'
import { supabase, GitHubEvent } from '../lib/supabase'

export const useGitHubEvents = () => {
  const [events, setEvents] = useState<GitHubEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('github_events')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100)

      if (error) throw error
      
      setEvents(data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching events:', err)
      setError('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
    
    // Poll for new events every 15 seconds
    const interval = setInterval(fetchEvents, 15000)
    
    return () => clearInterval(interval)
  }, [])

  return { events, loading, error, refetch: fetchEvents }
}