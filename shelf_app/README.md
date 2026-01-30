# Shelf App - Next.js Version

Your digital library for organizing and sharing favorites.

## Quick Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Supabase
- Go to [supabase.com](https://supabase.com) and create a project
- Run the SQL from `database-setup.sql` in the SQL Editor
- Create a storage bucket called `images` (make it public)

### 3. Add environment variables
Create a file called `.env.local` in the root folder:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Vercel
- Push to GitHub
- Import in Vercel
- Add the same environment variables
- Deploy!

## Features
- ✅ User accounts
- ✅ Create albums
- ✅ Add items with links
- ✅ Public/Private albums
- ✅ Discover other users
- ✅ Like albums
- ✅ Light/Dark mode
