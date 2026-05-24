# Stock IV – Deployment & Database Setup Guide

This guide walks you through:
1. Creating a free Supabase PostgreSQL database
2. Setting up environment variables
3. Deploying to Vercel

---

## Step 1: Create Supabase Database (Free)

### 1.1 Sign up at Supabase
- Go to https://supabase.com
- Click **"Sign Up"**
- Use Google, GitHub, or email
- Confirm email if needed

### 1.2 Create a new project
- Click **"New Project"**
- **Project name**: `stock-iv` (or any name)
- **Database password**: Generate a strong password (save this!)
- **Region**: Choose nearest to you (e.g., Singapore, US West)
- Click **"Create new project"** (takes ~2 min)

### 1.3 Get connection details
Once project loads:
- Go to **Settings** (⚙️ bottom left)
- Click **Database**
- Under "Connection pooling", copy:
  - **Host**: `xxx.supabase.co`
  - **Port**: `5432`
  - **Database**: `postgres`
  - **User**: `postgres`
  - **Password**: (the one you set)
  
OR copy the full **Connection String** (looks like: `postgresql://postgres:password@host:5432/postgres`)

### 1.4 Create database tables
- Go to **SQL Editor** (left sidebar)
- Click **New Query**
- Paste this SQL and run it:

```sql
-- Create stocks table
CREATE TABLE stocks (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  type_code VARCHAR(20),
  ward_id VARCHAR(50),
  lot_number VARCHAR(100),
  quantity INTEGER,
  unit VARCHAR(20) DEFAULT 'ขวด',
  expiry_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create movements table (add/remove history)
CREATE TABLE movements (
  id SERIAL PRIMARY KEY,
  stock_id INTEGER REFERENCES stocks(id),
  type VARCHAR(20), -- 'in', 'out'
  quantity INTEGER,
  notes VARCHAR(255),
  created_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_stocks_ward ON stocks(ward_id);
CREATE INDEX idx_stocks_expiry ON stocks(expiry_date);
CREATE INDEX idx_movements_stock ON movements(stock_id);
```

✅ You should see: "Success. No rows returned"

---

## Step 2: Get API Keys

### 2.1 Get Supabase keys
- Go to **Settings** → **API**
- Copy:
  - **Project URL**: `https://xxxxx.supabase.co` (the `SUPABASE_URL`)
  - **anon public**: (the `SUPABASE_ANON_KEY`)

### 2.2 Save these for later
You'll need:
- `SUPABASE_URL` (the Project URL)
- `SUPABASE_ANON_KEY` (the anon public key)

---

## Step 3: Prepare Code for Vercel

The app code is ready. You just need to:

1. **Initialize Git** (if not already)
   ```bash
   cd ~/สารน้ำ
   git init
   git add .
   git commit -m "Initial Stock IV app"
   ```

2. **Push to GitHub**
   - Create a new GitHub repo (https://github.com/new)
   - Name it `stock-iv`
   - Copy the push commands and run them:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/stock-iv.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 4: Deploy to Vercel (Free)

### 4.1 Sign up at Vercel
- Go to https://vercel.com/signup
- Click **"Continue with GitHub"**
- Authorize Vercel to access your GitHub repos

### 4.2 Import the project
- Click **"Import Project"** or go to https://vercel.com/new
- Click **"Import Git Repository"**
- Find and select `stock-iv`
- Click **Import**

### 4.3 Add environment variables
- Under **Environment Variables**, add:
  - Name: `SUPABASE_URL` → Value: (paste from step 2.1)
  - Name: `SUPABASE_ANON_KEY` → Value: (paste from step 2.1)
- Click **Add**

### 4.4 Deploy
- Click **"Deploy"**
- Wait ~2 min
- You'll get a live URL like: `https://stock-iv.vercel.app`

✅ **Your app is now live!**

---

## Step 5: Test the database

Once deployed:
1. Open your live URL
2. Go to the **"เพิ่ม/ลงข้อมูล"** (Add) page
3. Try adding a stock item
4. Check Supabase:
   - Go to **SQL Editor** → **Browse** → `stocks` table
   - You should see your new record!

---

## Troubleshooting

**"Database connection failed"**
- Check `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct
- Verify they're set in Vercel: Project Settings → Environment Variables

**"Deploy failed"**
- Check build logs in Vercel dashboard
- Make sure `package.json` has all dependencies (we'll add these)

**"Page is blank"**
- Open browser DevTools (F12) → Console
- Look for errors
- Refresh page

---

## Next: Code Changes

The API integration code is ready. Once you complete these steps, reply and I'll add:
- Supabase client setup
- Database fetch/insert functions
- Connect UI to real data

For now, the app still uses mock data.
