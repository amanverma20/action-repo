import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface GitHubEvent {
  id?: string
  action_type: 'push' | 'pull_request' | 'merge'
  author: string
  from_branch?: string
  to_branch: string
  timestamp: string
  repository: string
  created_at?: string
}