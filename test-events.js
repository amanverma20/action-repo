import { createClient } from '@supabase/supabase-js'

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const testEvents = [
  {
    action_type: 'push',
    author: 'TestUser',
    to_branch: 'main',
    timestamp: new Date().toISOString(),
    repository: 'test-repo'
  },
  {
    action_type: 'pull_request',
    author: 'DevUser',
    from_branch: 'feature-branch',
    to_branch: 'main',
    timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
    repository: 'test-repo'
  },
  {
    action_type: 'merge',
    author: 'MaintainerUser',
    from_branch: 'hotfix',
    to_branch: 'main',
    timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
    repository: 'test-repo'
  }
]

async function insertTestEvents() {
  console.log('Inserting test events...')
  
  for (const event of testEvents) {
    const { data, error } = await supabase
      .from('github_events')
      .insert([event])
    
    if (error) {
      console.error('Error inserting event:', error)
    } else {
      console.log(`✅ Inserted ${event.action_type} event by ${event.author}`)
    }
  }
  
  console.log('Test events inserted successfully!')
}

insertTestEvents().catch(console.error)