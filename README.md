# 🔍 Snapfind — Product Image Search

Upload any product image → get price, details, and payment options from any store instantly.

---

## 🚀 Deploy to Vercel (FREE) — Step by Step

### Step 1 — Get a free GitHub account
Go to **github.com** and sign up if you don't have one.

### Step 2 — Create a new GitHub repository
1. Click the **+** button at the top right → **New repository**
2. Name it `snapfind`
3. Set it to **Public**
4. Click **Create repository**

### Step 3 — Upload these files to GitHub
On the new empty repo page:
1. Click **uploading an existing file**
2. Drag ALL the files from this folder into the upload area:
   - `package.json`
   - `vite.config.js`
   - `index.html`
   - `vercel.json`
   - `src/` folder (with `main.jsx` and `App.jsx`)
   - `api/` folder (with `search.js`)
3. Click **Commit changes**

### Step 4 — Get your Anthropic API Key
1. Go to **console.anthropic.com**
2. Sign up / log in
3. Click **API Keys** in the left sidebar
4. Click **Create Key** → copy it (starts with `sk-ant-`)

### Step 5 — Deploy on Vercel
1. Go to **vercel.com** → Sign up with your GitHub account
2. Click **Add New Project**
3. Find and click your `snapfind` repository → click **Import**
4. Before clicking Deploy, click **Environment Variables**
5. Add this variable:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** paste your `sk-ant-...` key
6. Click **Add** then click **Deploy**
7. Wait ~1 minute — Vercel builds and deploys your app

### Step 6 — Open your live app!
Vercel gives you a URL like `https://snapfind-xyz.vercel.app`
That's your permanent link — share it or bookmark it, it works from anywhere!

---

## 📁 File Structure
```
snapfind/
├── api/
│   └── search.js        ← Server proxy (bypasses CORS, keeps API key safe)
├── src/
│   ├── App.jsx          ← Main React app
│   └── main.jsx         ← React entry point
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

## 💡 How it works
- Your browser calls `/api/search` on YOUR Vercel server
- Vercel's server calls Anthropic's API (no CORS because it's server-to-server)
- Your API key never touches the browser — it lives safely in Vercel's environment
