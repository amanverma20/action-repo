import React, { useState } from 'react'
import { Copy, Check, ExternalLink, Settings } from 'lucide-react'

export const WebhookSetup: React.FC = () => {
  const [copied, setCopied] = useState(false)
  const webhookUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/github-webhook`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Webhook Setup</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Webhook URL
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-900 border border-gray-600 rounded-lg p-3 font-mono text-sm text-gray-300">
              {webhookUrl}
            </div>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-600 rounded-lg p-4">
          <h4 className="font-medium text-white mb-2">Setup Instructions:</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
            <li>Go to your GitHub repository settings</li>
            <li>Navigate to "Webhooks" section</li>
            <li>Click "Add webhook"</li>
            <li>Paste the webhook URL above</li>
            <li>Set Content type to "application/json"</li>
            <li>Select individual events: Push, Pull requests</li>
            <li>Click "Add webhook"</li>
          </ol>
        </div>

        <div className="flex items-center gap-2 text-sm text-blue-400">
          <ExternalLink className="w-4 h-4" />
          <a 
            href="https://docs.github.com/en/developers/webhooks-and-events/webhooks/creating-webhooks"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            GitHub Webhook Documentation
          </a>
        </div>
      </div>
    </div>
  )
}