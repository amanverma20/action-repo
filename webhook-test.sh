#!/bin/bash

# Get your Supabase URL from environment variables
if [ -f .env ]; then
    while IFS= read -r line; do
        # Skip empty lines and comments
        if [[ -n "$line" && ! "$line" =~ ^[[:space:]]*# ]]; then
            export "$line"
        fi
    done < <(grep -v '^[[:space:]]*#' .env | grep -v '^[[:space:]]*$')
fi

if [ -z "$VITE_SUPABASE_URL" ]; then
    echo "❌ VITE_SUPABASE_URL not found in .env file"
    echo "Please make sure your .env file contains your Supabase URL"
    exit 1
fi

WEBHOOK_URL="${VITE_SUPABASE_URL}/functions/v1/github-webhook"

echo "🚀 Testing webhook endpoint: $WEBHOOK_URL"
echo ""

# Test 1: Push event
echo "📤 Testing PUSH event..."
curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -H "X-GitHub-Event: push" \
  -d '{
    "ref": "refs/heads/main",
    "repository": {
      "name": "test-repo",
      "full_name": "user/test-repo"
    },
    "pusher": {
      "name": "TestUser"
    },
    "sender": {
      "login": "TestUser"
    }
  }'

echo -e "\n"

# Test 2: Pull Request event
echo "🔄 Testing PULL REQUEST event..."
curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -H "X-GitHub-Event: pull_request" \
  -d '{
    "action": "opened",
    "repository": {
      "name": "test-repo",
      "full_name": "user/test-repo"
    },
    "sender": {
      "login": "PRUser"
    },
    "pull_request": {
      "head": {
        "ref": "feature-branch"
      },
      "base": {
        "ref": "main"
      }
    }
  }'

echo -e "\n"

# Test 3: Merge event (closed PR with merged=true)
echo "🔀 Testing MERGE event..."
curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -H "X-GitHub-Event: pull_request" \
  -d '{
    "action": "closed",
    "repository": {
      "name": "test-repo",
      "full_name": "user/test-repo"
    },
    "sender": {
      "login": "MergeUser"
    },
    "pull_request": {
      "head": {
        "ref": "hotfix-branch"
      },
      "base": {
        "ref": "main"
      },
      "merged": true
    }
  }'

echo -e "\n"
echo "✅ All webhook tests completed!"
echo "Check your dashboard to see if the events appeared."