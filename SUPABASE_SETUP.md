# 🚀 NeoMe Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign in with GitHub/Google
4. Click "New Project"
5. Choose organization and enter:
   - **Name**: `neome-wellness-app`
   - **Database Password**: Generate a secure password (save it!)
   - **Region**: Europe (Frankfurt) - closest to Slovakia

## Step 2: Get Your Project Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...` (long string)

## Step 3: Create Environment File

1. In your project folder `projects/neome/neomezvykynew/`, create `.env`:

```bash
# Copy from .env.example and fill in your values
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_APP_URL=https://neome-wellness-app.netlify.app
```

**⚠️ Important**: Never commit `.env` to git! It's already in `.gitignore`.

## Step 4: Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `database/schema.sql`
4. Paste and click **Run**
5. You should see "Success. No rows returned" - this is correct!

## Step 5: Configure Authentication

1. Go to **Authentication** → **Settings**
2. **Site URL**: `https://neome-wellness-app.netlify.app`
3. **Redirect URLs**: Add:
   - `https://neome-wellness-app.netlify.app`
   - `http://localhost:5173` (for development)
4. **Email Templates**: Customize signup/reset emails (optional)
5. **Email Auth**: Enable (should be on by default)

## Step 6: Set Up Row Level Security

The schema already includes RLS policies, but verify:

1. Go to **Authentication** → **Policies**
2. You should see policies for all tables
3. If not, re-run the schema.sql

## Step 7: Test the Setup

1. Start your development server: `npm run dev`
2. Go to `http://localhost:5173`
3. Try to register a new account
4. Check **Authentication** → **Users** in Supabase - you should see your user
5. Check **Database** → **user_profiles** - should have your profile

## Step 8: Deploy Environment Variables

For Netlify deployment:

1. Go to Netlify dashboard → Your site → **Site settings**
2. **Environment variables** → **Add variable**
3. Add each variable from your `.env` file:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_APP_URL`

## Step 9: Verify Everything Works

After deployment:
1. Visit your live app
2. Register new account
3. Try logging in/out
4. Check that data persists (habits, favorites, etc.)

## 💰 Pricing (Current Usage)

**Free Tier Includes:**
- 50,000 monthly active users
- 500MB database storage
- 1GB file storage
- 2 million API requests

**This covers you until ~20,000 active users!**

## 🚨 Troubleshooting

**"Invalid API key" error:**
- Check your environment variables
- Make sure you're using the `anon` key, not the `service_role` key

**"User not found" error:**
- Check Row Level Security policies
- Verify user_profiles table was created

**Database connection issues:**
- Check your project URL is correct
- Verify your project is active (not paused)

**Need help?** The schema and hooks are all set up - just need the Supabase project configured!

## 📞 Support

If you run into any issues during setup, I can help you debug through our next session. The hardest part is the initial Supabase project creation - after that, everything should work automatically! 🚀