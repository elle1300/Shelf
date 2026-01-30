-- ============================================
-- SHELF APP - DATABASE SETUP
-- ============================================
-- Copy this entire file and paste it into 
-- Supabase SQL Editor, then click "Run"
-- ============================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES TABLE (User information)
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  display_name text,
  bio text,
  avatar_url text,
  avatar_color text default '#5A67D8',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone" 
  on public.profiles for select 
  using (true);

create policy "Users can insert their own profile" 
  on public.profiles for insert 
  with check (auth.uid() = id);

create policy "Users can update their own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

-- ============================================
-- ALBUMS TABLE
-- ============================================
create table public.albums (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  cover_url text,
  cover_color text default '#5A67D8',
  icon text default 'image',
  is_public boolean default false,
  likes_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.albums enable row level security;

-- Policies for albums
create policy "Public albums are viewable by everyone" 
  on public.albums for select 
  using (is_public = true or auth.uid() = user_id);

create policy "Users can insert their own albums" 
  on public.albums for insert 
  with check (auth.uid() = user_id);

create policy "Users can update their own albums" 
  on public.albums for update 
  using (auth.uid() = user_id);

create policy "Users can delete their own albums" 
  on public.albums for delete 
  using (auth.uid() = user_id);

-- ============================================
-- ITEMS TABLE (Items inside albums)
-- ============================================
create table public.items (
  id uuid default uuid_generate_v4() primary key,
  album_id uuid references public.albums(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  image_url text,
  image_color text default '#5A67D8',
  link text,
  position integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.items enable row level security;

-- Policies for items
create policy "Items are viewable if album is public or owned" 
  on public.items for select 
  using (
    exists (
      select 1 from public.albums 
      where albums.id = items.album_id 
      and (albums.is_public = true or albums.user_id = auth.uid())
    )
  );

create policy "Users can insert items into their own albums" 
  on public.items for insert 
  with check (auth.uid() = user_id);

create policy "Users can update their own items" 
  on public.items for update 
  using (auth.uid() = user_id);

create policy "Users can delete their own items" 
  on public.items for delete 
  using (auth.uid() = user_id);

-- ============================================
-- LIKES TABLE (Album likes)
-- ============================================
create table public.likes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  album_id uuid references public.albums(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, album_id)
);

-- Enable Row Level Security
alter table public.likes enable row level security;

-- Policies for likes
create policy "Likes are viewable by everyone" 
  on public.likes for select 
  using (true);

create policy "Users can insert their own likes" 
  on public.likes for insert 
  with check (auth.uid() = user_id);

create policy "Users can delete their own likes" 
  on public.likes for delete 
  using (auth.uid() = user_id);

-- ============================================
-- FOLLOWS TABLE (User follows)
-- ============================================
create table public.follows (
  id uuid default uuid_generate_v4() primary key,
  follower_id uuid references public.profiles(id) on delete cascade not null,
  following_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(follower_id, following_id)
);

-- Enable Row Level Security
alter table public.follows enable row level security;

-- Policies for follows
create policy "Follows are viewable by everyone" 
  on public.follows for select 
  using (true);

create policy "Users can follow others" 
  on public.follows for insert 
  with check (auth.uid() = follower_id);

create policy "Users can unfollow" 
  on public.follows for delete 
  using (auth.uid() = follower_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to automatically create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'username', 'New User')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on new user signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update likes count on albums
create or replace function public.update_album_likes_count()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update public.albums 
    set likes_count = likes_count + 1 
    where id = NEW.album_id;
    return NEW;
  elsif (TG_OP = 'DELETE') then
    update public.albums 
    set likes_count = likes_count - 1 
    where id = OLD.album_id;
    return OLD;
  end if;
  return null;
end;
$$ language plpgsql security definer;

-- Trigger for likes count
create or replace trigger on_like_change
  after insert or delete on public.likes
  for each row execute procedure public.update_album_likes_count();

-- ============================================
-- STORAGE BUCKET FOR IMAGES
-- ============================================
-- Note: You'll need to create this manually in Supabase Dashboard
-- Go to Storage → New Bucket → Name it "images" → Make it public

-- ============================================
-- DONE! Your database is ready.
-- ============================================
