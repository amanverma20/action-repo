#!/bin/bash

WEBHOOK_URL="https://umjsbhgcthntrrkjxpyy.supabase.co/functions/v1/github-webhook"

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