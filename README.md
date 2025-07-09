# 🚀 GitHub Webhook Dashboard

A beautiful, real-time dashboard for monitoring GitHub repository events via webhooks.

🌐 **Live Demo**: [https://shiny-madeleine-1aab65.netlify.app](https://shiny-madeleine-1aab65.netlify.app)

---

## 📌 Features

- ⚡ **Real-time Event Monitoring**: Displays GitHub events as they happen
- 🔁 **Auto-refresh**: Polls for new events every 15 seconds
- 🔀 **Multi-Event Support**: Push, Pull Request, Merge
- 🔎 **Event Filtering**: View specific event types
- 📊 **Analytics Dashboard**: Visualize event frequency and trends
- 🧑‍💻 **Contributor Analytics**: Top contributors and their actions
- 📁 **Repository Management**: Monitor multiple repos
- 🌓 **Dark Theme**: GitHub-inspired UI
- 📱 **Responsive Design**: Mobile-friendly interface

---

## 🛠️ Setup Instructions

### 1. Database Setup

- For MongoDB:
  - Use local MongoDB or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
  - Create database: `webhookDB`
  - Create collection: `github_events`

- For Supabase (optional if you're using Supabase backend):
  1. Click the "Connect to Supabase" button in Bolt (or setup manually)
  2. Database schema is auto-created via migration

### 2. GitHub Webhook Configuration

1. Go to your GitHub repository (`action-repo`) → **Settings** → **Webhooks**
2. Click **Add Webhook**
3. Set Payload URL to one of:
   - Flask: `https://<your-ngrok-url>/webhook`
   - Supabase: `https://your-project.supabase.co/functions/v1/github-webhook`
4. Content type: `application/json`
5. Events to send:
   - ✅ Push
   - ✅ Pull Request
   - ✅ Merge (manual setup or additional handling)
6. Click **Add Webhook**

---

## 🌐 Frontend Setup

### Using React (Netlify Deployment)

1. Clone the frontend:
   ```bash
   git clone https://github.com/your-username/webhook-dashboard.git
   cd webhook-dashboard
