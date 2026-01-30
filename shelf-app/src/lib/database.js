import { supabase } from './supabase'

// ============================================
// ALBUMS
// ============================================

export async function getMyAlbums(userId) {
  const { data, error } = await supabase
    .from('albums')
    .select(`
      *,
      items (count)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return { data, error }
}

export async function getPublicAlbums(limit = 20) {
  const { data, error } = await supabase
    .from('albums')
    .select(`
      *,
      profiles:user_id (id, username, display_name, avatar_url, avatar_color),
      items (count)
    `)
    .eq('is_public', true)
    .order('likes_count', { ascending: false })
    .limit(limit)

  return { data, error }
}

export async function getUserPublicAlbums(userId) {
  const { data, error } = await supabase
    .from('albums')
    .select(`
      *,
      items (count)
    `)
    .eq('user_id', userId)
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  return { data, error }
}

export async function getAlbumById(albumId) {
  const { data, error } = await supabase
    .from('albums')
    .select(`
      *,
      profiles:user_id (id, username, display_name, avatar_url, avatar_color)
    `)
    .eq('id', albumId)
    .single()

  return { data, error }
}

export async function createAlbum(album) {
  const { data, error } = await supabase
    .from('albums')
    .insert(album)
    .select()
    .single()

  return { data, error }
}

export async function updateAlbum(albumId, updates) {
  const { data, error } = await supabase
    .from('albums')
    .update(updates)
    .eq('id', albumId)
    .select()
    .single()

  return { data, error }
}

export async function deleteAlbum(albumId) {
  const { error } = await supabase
    .from('albums')
    .delete()
    .eq('id', albumId)

  return { error }
}

// ============================================
// ITEMS
// ============================================

export async function getAlbumItems(albumId) {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('album_id', albumId)
    .order('position', { ascending: true })

  return { data, error }
}

export async function createItem(item) {
  const { data, error } = await supabase
    .from('items')
    .insert(item)
    .select()
    .single()

  return { data, error }
}

export async function updateItem(itemId, updates) {
  const { data, error } = await supabase
    .from('items')
    .update(updates)
    .eq('id', itemId)
    .select()
    .single()

  return { data, error }
}

export async function deleteItem(itemId) {
  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', itemId)

  return { error }
}

// ============================================
// LIKES
// ============================================

export async function likeAlbum(userId, albumId) {
  const { data, error } = await supabase
    .from('likes')
    .insert({ user_id: userId, album_id: albumId })
    .select()
    .single()

  return { data, error }
}

export async function unlikeAlbum(userId, albumId) {
  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('user_id', userId)
    .eq('album_id', albumId)

  return { error }
}

export async function getUserLikes(userId) {
  const { data, error } = await supabase
    .from('likes')
    .select('album_id')
    .eq('user_id', userId)

  return { data: data?.map(l => l.album_id) || [], error }
}

// ============================================
// FOLLOWS
// ============================================

export async function followUser(followerId, followingId) {
  const { data, error } = await supabase
    .from('follows')
    .insert({ follower_id: followerId, following_id: followingId })
    .select()
    .single()

  return { data, error }
}

export async function unfollowUser(followerId, followingId) {
  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', followerId)
    .eq('following_id', followingId)

  return { error }
}

export async function getFollowers(userId) {
  const { data, error } = await supabase
    .from('follows')
    .select('follower_id, profiles:follower_id(*)')
    .eq('following_id', userId)

  return { data, error }
}

export async function getFollowing(userId) {
  const { data, error } = await supabase
    .from('follows')
    .select('following_id, profiles:following_id(*)')
    .eq('follower_id', userId)

  return { data, error }
}

export async function isFollowing(followerId, followingId) {
  const { data, error } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .single()

  return { isFollowing: !!data, error }
}

// ============================================
// PROFILES
// ============================================

export async function getProfileByUsername(username) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  return { data, error }
}

export async function getProfileById(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  return { data, error }
}

export async function getFeaturedProfiles(limit = 10) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(limit)

  return { data, error }
}

// ============================================
// STORAGE (Image uploads)
// ============================================

export async function uploadImage(file, bucket = 'images') {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `${fileName}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file)

  if (error) return { url: null, error }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return { url: urlData.publicUrl, error: null }
}

// ============================================
// SEARCH
// ============================================

export async function searchAlbums(query) {
  const { data, error } = await supabase
    .from('albums')
    .select(`
      *,
      profiles:user_id (id, username, display_name, avatar_url, avatar_color)
    `)
    .eq('is_public', true)
    .ilike('name', `%${query}%`)
    .limit(20)

  return { data, error }
}

export async function searchProfiles(query) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
    .limit(20)

  return { data, error }
}
