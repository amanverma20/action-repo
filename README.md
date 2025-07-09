# GitHub Webhook Dashboard

A beautiful, real-time dashboard for monitoring GitHub repository events through webhooks.

## Features

- **Real-time Event Monitoring**: Automatically displays GitHub events as they happen
- **Multi-Event Support**: Handles Push, Pull Request, and Merge actions
- **Auto-refresh**: Updates every 15 seconds to show latest events
- **Event Filtering**: Filter events by type (Push, Pull Request, Merge)
- **Analytics Dashboard**: Visual charts showing activity over time
- **Repository Management**: Track activity across multiple repositories
- **Contributor Analytics**: See top contributors and their activity
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Dark Theme**: GitHub-inspired dark interface

## Setup Instructions

### 1. Database Setup

1. Click the "Connect to Supabase" button in Bolt to set up your database
2. The database schema will be automatically created with the migration file

### 2. GitHub Webhook Configuration

1. Go to your GitHub repository settings
2. Navigate to "Webhooks" section
3. Click "Add webhook"
4. Set the Payload URL to: `https://your-project.supabase.co/functions/v1/github-webhook`
5. Set Content type to: `application/json`
6. Select individual events:
   - Push
   - Pull requests
7. Click "Add webhook"

### 3. Environment Variables

Create a `.env` file with your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Start the Application

```bash
npm run dev
```

## Event Formats

The dashboard displays events in these formats:

**Push Events:**
`{author} pushed to {to_branch} on {timestamp}`

**Pull Request Events:**
`{author} submitted a pull request from {from_branch} to {to_branch} on {timestamp}`

**Merge Events:**
`{author} merged branch {from_branch} to {to_branch} on {timestamp}`

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Supabase Edge Functions
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Architecture

- **Webhook Receiver**: Supabase Edge Function that processes GitHub webhooks
- **Database**: PostgreSQL table storing event data with RLS policies
- **Frontend**: React application that polls for updates every 15 seconds
- **Real-time Updates**: Automatic refresh mechanism for live event monitoring

## Database Schema

The `github_events` table includes:
- `id`: UUID primary key
- `action_type`: Event type (push, pull_request, merge)
- `author`: GitHub username who performed the action
- `from_branch`: Source branch (for PRs and merges)
- `to_branch`: Target branch
- `timestamp`: When the event occurred
- `repository`: Repository name
- `created_at`: When the record was created

## Security

- Row Level Security (RLS) enabled on all tables
- Public read access for displaying events
- Authenticated insert access for webhook processing
- CORS headers configured for webhook endpoints