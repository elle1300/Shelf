# 🚀 Shelf App - Setup Guide for Beginners

Welcome! This guide will walk you through getting your app live on the internet. No coding experience needed - just follow the steps!

---

## 📋 What You'll Have When Done

- A real website URL (like `shelf-app.vercel.app`)
- Users can sign up and create accounts
- Albums and items save to a real database
- Works on phones, tablets, and computers

---

## ⏱️ Time Needed: About 30-45 minutes

---

## Step 1: Create a Supabase Account (Your Database)

Supabase is where all your app's data will be stored - users, albums, items, etc.

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"** (top right)
3. Sign up with your GitHub account (easiest) or email
4. Click **"New Project"**
5. Fill in:
   - **Name:** `shelf-app`
   - **Database Password:** Make something strong and **SAVE IT SOMEWHERE**
   - **Region:** Pick the closest to you
6. Click **"Create new project"**
7. Wait 2-3 minutes for it to set up

### Get Your Supabase Keys

Once your project is ready:

1. Click **"Settings"** (gear icon) in the left sidebar
2. Click **"API"** under Configuration
3. You'll see two important values - **keep this page open**, you'll need them later:
   - `Project URL` (looks like `https://xxxxx.supabase.co`)
   - `anon public` key (a long string of letters/numbers)

---

## Step 2: Set Up Your Database Tables

Still in Supabase:

1. Click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Copy ALL the code from the file `database-setup.sql` (included in this project)
4. Paste it into the SQL editor
5. Click **"Run"** (or press Ctrl+Enter / Cmd+Enter)
6. You should see "Success" message

This creates all the tables needed to store users, albums, and items.

---

## Step 3: Create a GitHub Account (If You Don't Have One)

GitHub is where your code will live. Vercel will read it from here.

1. Go to [github.com](https://github.com)
2. Click **"Sign up"**
3. Follow the steps to create an account
4. Verify your email

---

## Step 4: Upload Your Code to GitHub

1. Log into GitHub
2. Click the **"+"** icon (top right) → **"New repository"**
3. Fill in:
   - **Repository name:** `shelf-app`
   - **Description:** `My digital library app`
   - Keep it **Public** (required for free Vercel hosting)
4. Click **"Create repository"**

Now you need to upload the project files. The easiest way:

### Option A: Using GitHub's Upload (Easiest)

1. On your new repository page, click **"uploading an existing file"**
2. Drag and drop ALL the files from this `shelf-app` folder
3. Click **"Commit changes"**

### Option B: Using Git Commands (If you have Git installed)

Open a terminal in the `shelf-app` folder and run:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/shelf-app.git
git push -u origin main
```

---

## Step 5: Deploy to Vercel (Put It Online!)

Vercel will host your app for free and give you a URL.

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** → **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub
4. Click **"Add New..."** → **"Project"**
5. Find `shelf-app` in the list and click **"Import"**

### Add Your Environment Variables

Before deploying, you need to add your Supabase keys:

1. Expand the **"Environment Variables"** section
2. Add these two variables:

   | Name | Value |
   |------|-------|
   | `VITE_SUPABASE_URL` | Your Project URL from Step 1 |
   | `VITE_SUPABASE_ANON_KEY` | Your anon public key from Step 1 |

3. Click **"Deploy"**
4. Wait 2-3 minutes for it to build

---

## 🎉 You're Done!

Vercel will give you a URL like `shelf-app.vercel.app` - that's your live app!

- Share this URL with friends
- It works on any device
- Users can sign up and start using it immediately

---

## 🔧 Making Changes Later

Whenever you want to update your app:

1. Edit the files in your project
2. Push the changes to GitHub
3. Vercel automatically detects changes and re-deploys

---

## 🆘 Common Issues & Fixes

### "Invalid API key" error
- Double-check your environment variables in Vercel
- Make sure there are no extra spaces
- Redeploy after fixing

### "Table doesn't exist" error
- Go back to Step 2 and run the SQL again
- Make sure you saw "Success" message

### Images not uploading
- In Supabase, go to Storage → Create a bucket called `images`
- Set it to "Public bucket"

### Can't log in after signing up
- In Supabase, go to Authentication → Settings
- Turn OFF "Enable email confirmations" for easier testing

---

## 📱 Bonus: Make It Feel Like a Real App on Phones

Tell your users to:

**iPhone:**
1. Open your app URL in Safari
2. Tap the Share button
3. Tap "Add to Home Screen"

**Android:**
1. Open your app URL in Chrome
2. Tap the menu (three dots)
3. Tap "Add to Home screen"

Now it opens like a real app with no browser bar!

---

## 🚀 What's Next?

Once you're up and running, you might want to:

- **Custom domain:** Buy a domain like `shelf.app` and connect it in Vercel
- **Analytics:** Add simple tracking to see how many people use it
- **Mobile apps:** Convert to iOS/Android apps with React Native

Need help? Feel free to ask!
