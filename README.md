# spaces.ai Daily Progress Tracker

A team daily progress tracking app with Google Sheets-style data persistence.

## Quick Deploy to Render (Free)

1. Create account at **render.com**
2. Click **New → Web Service**
3. Connect your GitHub repo (or upload this folder)
4. Set:
   - Build Command: `npm install`
   - Start Command: `node server.js`
5. Click **Deploy** — you get a permanent URL like `your-app.onrender.com`

## Quick Deploy to Railway ($5/month)

1. Create account at **railway.app**
2. Click **New Project → Deploy from GitHub**
3. It auto-detects Node.js and deploys
4. You get a permanent URL instantly

## Local Development

```bash
npm install
npm start
```

Open http://localhost:3000

## Features
- Daily check-in form with priorities, energy, word of the day
- Yesterday's commitments checklist
- Friday reflection + monthly review
- Team dashboard with task completion, energy levels, responses
- Shout-outs / core values recognition
- My Calendar view
- Manage team members
- All data persists in SQLite database

## Team
All 21 team members pre-loaded. Add/remove from Manage Team tab.
