'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { 
  Plus, Sparkles, ExternalLink, ArrowLeft, X, Music, BookOpen, Film, 
  Utensils, Dumbbell, Palette, Image, Upload, User, Globe, Lock, 
  Heart, Search, Home, Compass, LogOut, Edit3, Check, Sun, Moon, Eye, EyeOff, Mail, Camera, Trash2, FileText, Users, UserPlus, UserCheck, Bookmark, BookmarkCheck
} from 'lucide-react'

// Trove Logo Component
function TroveLogo({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }
  
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={`${sizes[size]} ${className}`}
      fill="none"
    >
      {/* Gem shape */}
      <defs>
        <linearGradient id="troveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      {/* Main gem body */}
      <polygon 
        points="50,5 90,35 75,95 25,95 10,35" 
        fill="url(#troveGradient)"
      />
      {/* Top facet */}
      <polygon 
        points="50,5 90,35 50,45 10,35" 
        fill="rgba(255,255,255,0.3)"
      />
      {/* Left facet */}
      <polygon 
        points="10,35 50,45 25,95" 
        fill="rgba(0,0,0,0.1)"
      />
      {/* Inner shine */}
      <polygon 
        points="50,45 90,35 75,95 25,95" 
        fill="rgba(255,255,255,0.1)"
      />
    </svg>
  )
}

// Icon options
const iconOptions = [
  { name: 'music', icon: Music },
  { name: 'book', icon: BookOpen },
  { name: 'film', icon: Film },
  { name: 'food', icon: Utensils },
  { name: 'fitness', icon: Dumbbell },
  { name: 'art', icon: Palette },
  { name: 'image', icon: Image },
]

const colorOptions = [
  "#E53E3E", "#DD6B20", "#D69E2E", "#38A169", "#319795", 
  "#3182CE", "#5A67D8", "#805AD5", "#D53F8C", "#718096"
]

// Helper Components
function ImageBox({ src, color, alt }) {
  if (src) {
    return <img src={src} alt={alt} className="w-full h-full object-cover" />
  }
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: color || '#5A67D8' }}>
      <div className="w-1/4 h-1/4 rounded-full bg-white/10" />
    </div>
  )
}

function Avatar({ user, size = "md" }) {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-16 h-16 text-xl", xl: "w-20 h-20 text-2xl" }
  return (
    <div 
      className={`${sizes[size]} rounded-full flex items-center justify-center font-medium text-white overflow-hidden flex-shrink-0`}
      style={{ backgroundColor: user?.avatar_color || '#5A67D8' }}
    >
      {user?.avatar_url ? (
        <img src={user.avatar_url} alt={user.display_name} className="w-full h-full object-cover" />
      ) : (
        (user?.display_name || user?.username || 'U').charAt(0).toUpperCase()
      )}
    </div>
  )
}

function Modal({ isOpen, onClose, title, children, isDark }) {
  if (!isOpen) return null
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.95)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="w-full max-w-sm rounded-2xl p-6 border animate-fade-in max-h-[90vh] overflow-y-auto"
        style={{ 
          backgroundColor: isDark ? '#171717' : '#ffffff',
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
        }}
      >
        {title && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-light">{title}</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:opacity-70 transition-opacity">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

// Main App Component
export default function TroveApp() {
  // Auth state
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // App state
  const [activeTab, setActiveTab] = useState('discover')
  const [albums, setAlbums] = useState([])
  const [publicAlbums, setPublicAlbums] = useState([])
  const [selectedAlbum, setSelectedAlbum] = useState(null)
  const [albumItems, setAlbumItems] = useState([])
  const [likedAlbums, setLikedAlbums] = useState([])
  const [savedAlbums, setSavedAlbums] = useState([])
  const [savedAlbumsData, setSavedAlbumsData] = useState([])
  const [following, setFollowing] = useState([])
  const [followingAlbums, setFollowingAlbums] = useState([])
  const [selectedUserProfile, setSelectedUserProfile] = useState(null)
  
  // UI state
  const [isDark, setIsDark] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAddItemModal, setShowAddItemModal] = useState(false)
  const [showEditProfileModal, setShowEditProfileModal] = useState(false)
  const [showEditAlbumModal, setShowEditAlbumModal] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [showPasswordResetSent, setShowPasswordResetSent] = useState(false)
  
  // Form state
  const [authForm, setAuthForm] = useState({ email: '', password: '', username: '', displayName: '' })
  const [newAlbum, setNewAlbum] = useState({ name: '', coverColor: '#5A67D8', icon: 'music', isPublic: false, coverImage: null, coverPreview: null })
  const [editAlbum, setEditAlbum] = useState({ name: '', coverColor: '#5A67D8', isPublic: false, coverImage: null, coverPreview: null })
  const [newItem, setNewItem] = useState({ title: '', link: '', notes: '', imageColor: '#5A67D8', image: null, imagePreview: null })
  const [editProfile, setEditProfile] = useState({ display_name: '', bio: '', avatar_color: '#5A67D8' })
  const [authError, setAuthError] = useState('')
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingItemImage, setUploadingItemImage] = useState(false)
  const [avatarImage, setAvatarImage] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  
  // Refs
  const coverInputRef = useRef(null)
  const editCoverInputRef = useRef(null)
  const avatarInputRef = useRef(null)
  const itemImageInputRef = useRef(null)

  // Initialize
  useEffect(() => {
    const savedTheme = localStorage.getItem('trove-theme')
    if (savedTheme) {
      setIsDark(savedTheme === 'dark')
      document.documentElement.classList.toggle('light-mode', savedTheme === 'light')
    }
    
    checkUser()
    fetchPublicAlbums()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchProfile(session.user.id)
        await fetchMyAlbums(session.user.id)
        await fetchLikes(session.user.id)
        await fetchSaved(session.user.id)
        await fetchFollowing(session.user.id)
        setActiveTab('home')
      } else {
        setProfile(null)
        setAlbums([])
        setSavedAlbums([])
        setSavedAlbumsData([])
        setFollowing([])
        setFollowingAlbums([])
        setActiveTab('discover')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user ?? null)
    if (session?.user) {
      await fetchProfile(session.user.id)
      await fetchMyAlbums(session.user.id)
      await fetchLikes(session.user.id)
      await fetchSaved(session.user.id)
      await fetchFollowing(session.user.id)
      setActiveTab('home')
    }
    setLoading(false)
  }

  const fetchProfile = async (userId) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (data) {
      setProfile(data)
      setEditProfile({ display_name: data.display_name || '', bio: data.bio || '', avatar_color: data.avatar_color || '#5A67D8' })
    }
  }

  const fetchMyAlbums = async (userId) => {
    const { data } = await supabase
      .from('albums')
      .select('*, items(count)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (data) setAlbums(data)
  }

  const fetchPublicAlbums = async () => {
    const { data } = await supabase
      .from('albums')
      .select('*, profiles:user_id(id, username, display_name, avatar_color), items(count)')
      .eq('is_public', true)
      .order('likes_count', { ascending: false })
      .limit(20)
    if (data) setPublicAlbums(data)
  }

  const fetchAlbumItems = async (albumId) => {
    const { data } = await supabase
      .from('items')
      .select('*')
      .eq('album_id', albumId)
      .order('created_at', { ascending: true })
    if (data) setAlbumItems(data)
  }

  const fetchLikes = async (userId) => {
    const { data } = await supabase.from('likes').select('album_id').eq('user_id', userId)
    if (data) setLikedAlbums(data.map(l => l.album_id))
  }

  const fetchSaved = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('saved_albums')
        .select('album_id')
        .eq('user_id', userId)
      
      if (error) {
        console.log('Saved albums table may not exist yet:', error.message)
        return
      }
      
      if (data) {
        const savedIds = data.map(s => s.album_id)
        setSavedAlbums(savedIds)
        
        // Fetch the actual album data
        if (savedIds.length > 0) {
          const { data: albumsData } = await supabase
            .from('albums')
            .select('*, profiles:user_id(id, username, display_name, avatar_color, avatar_url), items(count)')
            .in('id', savedIds)
          if (albumsData) setSavedAlbumsData(albumsData)
        }
      }
    } catch (err) {
      console.log('Error fetching saved:', err)
    }
  }

  const fetchFollowing = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', userId)
      
      if (error) {
        console.log('Follows table may not exist yet:', error.message)
        return
      }
      
      if (data) {
        const followingIds = data.map(f => f.following_id)
        setFollowing(followingIds)
        // Fetch albums from people we follow
        if (followingIds.length > 0) {
          const { data: albums } = await supabase
            .from('albums')
            .select('*, profiles:user_id(id, username, display_name, avatar_color, avatar_url), items(count)')
            .in('user_id', followingIds)
            .eq('is_public', true)
            .order('created_at', { ascending: false })
            .limit(50)
          if (albums) setFollowingAlbums(albums)
        }
      }
    } catch (err) {
      console.log('Error fetching following:', err)
    }
  }

  const fetchUserProfile = async (userId) => {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    const { data: albumsData } = await supabase
      .from('albums')
      .select('*, items(count)')
      .eq('user_id', userId)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
    
    // Get follower count
    const { count: followersCount } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', userId)
    
    // Get following count
    const { count: followingCount } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', userId)
    
    if (profileData) {
      setSelectedUserProfile({
        ...profileData,
        albums: albumsData || [],
        followers_count: followersCount || 0,
        following_count: followingCount || 0
      })
    }
  }

  // Auth handlers
  const handleAuth = async (e) => {
    e.preventDefault()
    setAuthError('')
    setSaving(true)
    
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: authForm.email,
          password: authForm.password
        })
        if (error) throw error
        setShowAuthModal(false)
        setShowEmailConfirmation(false)
      } else {
        const { error } = await supabase.auth.signUp({
          email: authForm.email,
          password: authForm.password,
          options: {
            data: {
              username: authForm.username.toLowerCase().trim(),
              display_name: authForm.displayName || authForm.username
            }
          }
        })
        if (error) throw error
        setShowEmailConfirmation(true)
      }
      setAuthForm({ email: '', password: '', username: '', displayName: '' })
    } catch (err) {
      setAuthError(err.message)
    }
    setSaving(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setActiveTab('discover')
  }

  // Forgot password handler
  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setAuthError('')
    setSaving(true)
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      setShowPasswordResetSent(true)
      setForgotPasswordEmail('')
    } catch (err) {
      setAuthError(err.message)
    }
    setSaving(false)
  }

  // Cover image handler
  const handleCoverImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB')
        return
      }
      setNewAlbum({ 
        ...newAlbum, 
        coverImage: file, 
        coverPreview: URL.createObjectURL(file) 
      })
    }
  }

  const removeCoverImage = () => {
    if (newAlbum.coverPreview) {
      URL.revokeObjectURL(newAlbum.coverPreview)
    }
    setNewAlbum({ ...newAlbum, coverImage: null, coverPreview: null })
  }

  // Upload cover image to Supabase Storage
  const uploadCoverImage = async (file, albumId) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${albumId}-${Date.now()}.${fileExt}`
    const filePath = `covers/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    return publicUrl
  }

  // Avatar image handlers
  const handleAvatarImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB')
        return
      }
      setAvatarImage(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const removeAvatarImage = () => {
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview)
    }
    setAvatarImage(null)
    setAvatarPreview(null)
  }

  const uploadAvatarImage = async (file, userId) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    return publicUrl
  }

  // Album handlers
  const handleCreateAlbum = async () => {
    if (!newAlbum.name.trim() || !user) return
    setSaving(true)
    
    try {
      // First create the album
      const { data, error } = await supabase
        .from('albums')
        .insert({
          user_id: user.id,
          name: newAlbum.name.trim(),
          cover_color: newAlbum.coverColor,
          icon: newAlbum.icon,
          is_public: newAlbum.isPublic
        })
        .select()
        .single()

      if (error) throw error

      // If there's a cover image, upload it
      if (newAlbum.coverImage && data) {
        setUploadingCover(true)
        const coverUrl = await uploadCoverImage(newAlbum.coverImage, data.id)
        
        // Update album with cover URL
        const { data: updatedAlbum } = await supabase
          .from('albums')
          .update({ cover_url: coverUrl })
          .eq('id', data.id)
          .select()
          .single()

        if (updatedAlbum) {
          setAlbums([updatedAlbum, ...albums])
        }
        setUploadingCover(false)
      } else if (data) {
        setAlbums([data, ...albums])
      }

      // Clean up
      if (newAlbum.coverPreview) {
        URL.revokeObjectURL(newAlbum.coverPreview)
      }
      setShowCreateModal(false)
      setNewAlbum({ name: '', coverColor: '#5A67D8', icon: 'music', isPublic: false, coverImage: null, coverPreview: null })
    } catch (err) {
      console.error('Error creating album:', err)
      alert('Failed to create collection. Please try again.')
    }
    setSaving(false)
  }

  const handleAddItem = async () => {
    if (!newItem.title.trim() || !selectedAlbum || !user) return
    setSaving(true)
    
    try {
      // First create the item
      const { data, error } = await supabase
        .from('items')
        .insert({
          album_id: selectedAlbum.id,
          user_id: user.id,
          title: newItem.title.trim(),
          link: newItem.link.trim() || null,
          notes: newItem.notes.trim() || null,
          image_color: newItem.imageColor
        })
        .select()
        .single()

      if (error) throw error

      // If there's an image, upload it
      if (newItem.image && data) {
        setUploadingItemImage(true)
        const imageUrl = await uploadItemImage(newItem.image, data.id)
        
        // Update item with image URL
        const { data: updatedItem } = await supabase
          .from('items')
          .update({ image_url: imageUrl })
          .eq('id', data.id)
          .select()
          .single()

        if (updatedItem) {
          setAlbumItems([...albumItems, updatedItem])
        }
        setUploadingItemImage(false)
      } else if (data) {
        setAlbumItems([...albumItems, data])
      }

      // Clean up
      if (newItem.imagePreview) {
        URL.revokeObjectURL(newItem.imagePreview)
      }
      setShowAddItemModal(false)
      setNewItem({ title: '', link: '', notes: '', imageColor: '#5A67D8', image: null, imagePreview: null })
    } catch (err) {
      console.error('Error adding item:', err)
      alert('Failed to add item. Please try again.')
    }
    setSaving(false)
  }

  // Item image handlers
  const handleItemImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB')
        return
      }
      setNewItem({ 
        ...newItem, 
        image: file, 
        imagePreview: URL.createObjectURL(file) 
      })
    }
  }

  const removeItemImage = () => {
    if (newItem.imagePreview) {
      URL.revokeObjectURL(newItem.imagePreview)
    }
    setNewItem({ ...newItem, image: null, imagePreview: null })
  }

  const uploadItemImage = async (file, itemId) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${itemId}-${Date.now()}.${fileExt}`
    const filePath = `items/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    return publicUrl
  }

  const handleTogglePrivacy = async () => {
    if (!selectedAlbum) return
    const { data } = await supabase
      .from('albums')
      .update({ is_public: !selectedAlbum.is_public })
      .eq('id', selectedAlbum.id)
      .select()
      .single()
    if (data) {
      setSelectedAlbum(data)
      setAlbums(albums.map(a => a.id === data.id ? data : a))
    }
  }

  // Save collection handler
  const handleSave = async (albumId) => {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    
    try {
      if (savedAlbums.includes(albumId)) {
        // Unsave
        await supabase
          .from('saved_albums')
          .delete()
          .eq('user_id', user.id)
          .eq('album_id', albumId)
        
        setSavedAlbums(savedAlbums.filter(id => id !== albumId))
        setSavedAlbumsData(savedAlbumsData.filter(a => a.id !== albumId))
      } else {
        // Save
        await supabase
          .from('saved_albums')
          .insert({ user_id: user.id, album_id: albumId })
        
        setSavedAlbums([...savedAlbums, albumId])
        
        // Fetch the album data to add to savedAlbumsData
        const { data: albumData } = await supabase
          .from('albums')
          .select('*, profiles:user_id(id, username, display_name, avatar_color, avatar_url), items(count)')
          .eq('id', albumId)
          .single()
        
        if (albumData) {
          setSavedAlbumsData([...savedAlbumsData, albumData])
        }
      }
    } catch (err) {
      console.log('Error saving album:', err)
    }
  }

  // Follow handlers
  const handleFollow = async (userIdToFollow) => {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    
    if (following.includes(userIdToFollow)) {
      // Unfollow
      await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', userIdToFollow)
      
      setFollowing(following.filter(id => id !== userIdToFollow))
      setFollowingAlbums(followingAlbums.filter(a => a.user_id !== userIdToFollow))
    } else {
      // Follow
      await supabase
        .from('follows')
        .insert({ follower_id: user.id, following_id: userIdToFollow })
      
      setFollowing([...following, userIdToFollow])
      
      // Fetch their public albums
      const { data: newAlbums } = await supabase
        .from('albums')
        .select('*, profiles:user_id(id, username, display_name, avatar_color, avatar_url), items(count)')
        .eq('user_id', userIdToFollow)
        .eq('is_public', true)
      
      if (newAlbums) {
        setFollowingAlbums([...newAlbums, ...followingAlbums])
      }
    }
  }

  const openUserProfile = async (userId) => {
    if (userId === user?.id) {
      setActiveTab('profile')
      return
    }
    await fetchUserProfile(userId)
  }

  // Edit album handlers
  const openEditAlbumModal = () => {
    if (!selectedAlbum) return
    setEditAlbum({
      name: selectedAlbum.name,
      coverColor: selectedAlbum.cover_color || '#5A67D8',
      isPublic: selectedAlbum.is_public,
      coverImage: null,
      coverPreview: selectedAlbum.cover_url || null
    })
    setShowEditAlbumModal(true)
  }

  const handleEditCoverImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB')
        return
      }
      setEditAlbum({ 
        ...editAlbum, 
        coverImage: file, 
        coverPreview: URL.createObjectURL(file) 
      })
    }
  }

  const removeEditCoverImage = () => {
    if (editAlbum.coverPreview && editAlbum.coverImage) {
      URL.revokeObjectURL(editAlbum.coverPreview)
    }
    setEditAlbum({ ...editAlbum, coverImage: null, coverPreview: null })
  }

  const handleUpdateAlbum = async () => {
    if (!editAlbum.name.trim() || !selectedAlbum || !user) return
    setSaving(true)
    
    try {
      let updateData = {
        name: editAlbum.name.trim(),
        cover_color: editAlbum.coverColor,
        is_public: editAlbum.isPublic
      }

      // If there's a new cover image, upload it
      if (editAlbum.coverImage) {
        setUploadingCover(true)
        const coverUrl = await uploadCoverImage(editAlbum.coverImage, selectedAlbum.id)
        updateData.cover_url = coverUrl
        setUploadingCover(false)
      } else if (!editAlbum.coverPreview) {
        // If cover was removed, clear it
        updateData.cover_url = null
      }

      const { data, error } = await supabase
        .from('albums')
        .update(updateData)
        .eq('id', selectedAlbum.id)
        .select()
        .single()

      if (error) throw error

      if (data) {
        setSelectedAlbum(data)
        setAlbums(albums.map(a => a.id === data.id ? data : a))
      }

      // Clean up
      if (editAlbum.coverImage && editAlbum.coverPreview) {
        URL.revokeObjectURL(editAlbum.coverPreview)
      }
      setShowEditAlbumModal(false)
    } catch (err) {
      console.error('Error updating album:', err)
      alert('Failed to update collection. Please try again.')
    }
    setSaving(false)
  }

  const handleDeleteAlbum = async () => {
    if (!selectedAlbum || !user) return
    
    const confirmed = window.confirm('Are you sure you want to delete this collection? This action cannot be undone.')
    if (!confirmed) return

    setSaving(true)
    try {
      // Delete all items in the album first
      await supabase
        .from('items')
        .delete()
        .eq('album_id', selectedAlbum.id)

      // Delete all likes for this album
      await supabase
        .from('likes')
        .delete()
        .eq('album_id', selectedAlbum.id)

      // Delete the album
      const { error } = await supabase
        .from('albums')
        .delete()
        .eq('id', selectedAlbum.id)

      if (error) throw error

      setAlbums(albums.filter(a => a.id !== selectedAlbum.id))
      setSelectedAlbum(null)
      setAlbumItems([])
      setShowEditAlbumModal(false)
    } catch (err) {
      console.error('Error deleting album:', err)
      alert('Failed to delete collection. Please try again.')
    }
    setSaving(false)
  }

  const handleLike = async (albumId) => {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    if (likedAlbums.includes(albumId)) {
      await supabase.from('likes').delete().eq('user_id', user.id).eq('album_id', albumId)
      setLikedAlbums(likedAlbums.filter(id => id !== albumId))
    } else {
      await supabase.from('likes').insert({ user_id: user.id, album_id: albumId })
      setLikedAlbums([...likedAlbums, albumId])
    }
  }

  // Profile handlers
  const handleUpdateProfile = async () => {
    if (!user) return
    setSaving(true)
    
    try {
      let updateData = { ...editProfile }
      
      // If there's a new avatar image, upload it
      if (avatarImage) {
        setUploadingAvatar(true)
        const avatarUrl = await uploadAvatarImage(avatarImage, user.id)
        updateData.avatar_url = avatarUrl
        setUploadingAvatar(false)
      }
      
      const { data } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single()
      
      if (data) setProfile(data)
      
      // Clean up
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview)
      }
      setAvatarImage(null)
      setAvatarPreview(null)
      setShowEditProfileModal(false)
    } catch (err) {
      console.error('Error updating profile:', err)
      alert('Failed to update profile. Please try again.')
    }
    setSaving(false)
  }

  // Theme handler
  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem('trove-theme', newTheme ? 'dark' : 'light')
    document.documentElement.classList.toggle('light-mode', !newTheme)
  }

  // Album card component
  const AlbumCard = ({ album, isOwn = false, showUser = false }) => {
    const itemCount = album.items?.[0]?.count ?? 0
    const isLiked = likedAlbums.includes(album.id)
    
    return (
      <div className="group text-left w-full">
        <button
          onClick={() => {
            setSelectedAlbum(album)
            fetchAlbumItems(album.id)
          }}
          className="w-full text-left"
        >
          <div className="relative aspect-square rounded-2xl overflow-hidden mb-2 transition-transform duration-300 group-hover:scale-[1.02]">
            <ImageBox src={album.cover_url} color={album.cover_color} alt={album.name} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="absolute top-2 right-2 flex items-center gap-1.5">
              {isOwn && (
                <div className={`p-1 rounded-full backdrop-blur-md ${album.is_public ? 'bg-green-500/20 border border-green-500/30' : 'bg-black/40 border border-white/10'}`}>
                  {album.is_public ? <Globe className="w-2.5 h-2.5 text-green-400" /> : <Lock className="w-2.5 h-2.5 text-white/50" />}
                </div>
              )}
              <div className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[10px] text-white/70">{itemCount}</div>
            </div>
            
            {!isOwn && (
              <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md">
                <Heart className={`w-2.5 h-2.5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white/50'}`} />
                <span className="text-[10px] text-white/70">{album.likes_count || 0}</span>
              </div>
            )}
          </div>
          <h3 className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{album.name}</h3>
        </button>
        {showUser && album.profiles && (
          <button 
            onClick={() => openUserProfile(album.profiles.id)}
            className="text-[10px] hover:text-emerald-400 transition-colors" 
            style={{ color: 'var(--text-muted)' }}
          >
            @{album.profiles.username}
          </button>
        )}
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="flex items-center gap-3">
          <TroveLogo size="sm" className="animate-pulse" />
          <span className="text-lg font-light" style={{ color: 'var(--text-muted)' }}>trove</span>
        </div>
      </div>
    )
  }

  // Styles based on theme
  const bgPrimary = { backgroundColor: 'var(--bg-primary)' }
  const bgSecondary = { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }
  const borderStyle = { borderColor: 'var(--border-color)' }
  const textMuted = { color: 'var(--text-muted)' }

  return (
    <div className="min-h-screen" style={{ ...bgPrimary, color: 'var(--text-primary)' }}>
      {/* Desktop Sidebar - hidden on mobile */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col border-r z-50" style={{ ...bgPrimary, ...borderStyle }}>
        {/* Logo */}
        <div className="p-6 border-b" style={borderStyle}>
          <span className="flex items-center gap-2">
            <TroveLogo size="md" />
            <span className="text-xl font-light">trove</span>
          </span>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4">
          {user ? (
            <div className="space-y-2">
              {[
                { id: 'home', icon: Home, label: 'My Collections' },
                { id: 'saved', icon: Bookmark, label: 'Saved' },
                { id: 'following', icon: Users, label: 'Following' },
                { id: 'discover', icon: Compass, label: 'Discover' },
                { id: 'profile', icon: User, label: 'Profile' },
              ].map(tab => (
                <button 
                  key={tab.id} 
                  onClick={() => { setActiveTab(tab.id); setSelectedAlbum(null); setAlbumItems([]); setSelectedUserProfile(null) }} 
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === tab.id && !selectedUserProfile ? 'bg-emerald-500/10 text-emerald-400' : 'hover:bg-white/5'}`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <button 
                onClick={() => setActiveTab('discover')} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'discover' ? 'bg-emerald-500/10 text-emerald-400' : 'hover:bg-white/5'}`}
              >
                <Compass className="w-5 h-5" />
                <span className="text-sm font-medium">Discover</span>
              </button>
            </div>
          )}
        </nav>
        
        {/* Bottom actions */}
        <div className="p-4 border-t" style={borderStyle}>
          {user ? (
            <div className="space-y-2">
              <button 
                onClick={() => setShowCreateModal(true)} 
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500 text-white font-medium text-sm hover:bg-emerald-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                New Collection
              </button>
              <button 
                onClick={handleSignOut} 
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors"
                style={textMuted}
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowAuthModal(true)} 
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm"
              style={{ backgroundColor: isDark ? '#fff' : '#000', color: isDark ? '#000' : '#fff' }}
            >
              Sign In
            </button>
          )}
        </div>
      </aside>

      {/* Main content wrapper */}
      <div className="lg:pl-64">
        {/* Header - different on mobile vs desktop */}
        <header className="sticky top-0 z-40 border-b backdrop-blur-xl lg:backdrop-blur-none" style={{ ...bgPrimary, ...borderStyle }}>
          <div className="max-w-lg lg:max-w-6xl mx-auto px-4 lg:px-8 py-3 lg:py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {selectedAlbum && (
                <button onClick={() => { setSelectedAlbum(null); setAlbumItems([]) }} className="p-2 -ml-2 rounded-full hover:opacity-70">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <h1 className="text-lg lg:text-xl font-light">
                {selectedAlbum ? selectedAlbum.name : (
                  <span className="flex items-center gap-2 lg:hidden">
                    <TroveLogo size="sm" />
                    trove
                  </span>
                )}
                {!selectedAlbum && (
                  <span className="hidden lg:block">
                    {activeTab === 'home' && 'My Collections'}
                    {activeTab === 'discover' && 'Discover'}
                    {activeTab === 'profile' && 'Profile'}
                  </span>
                )}
              </h1>
            </div>
            
            {/* Header right side */}
            {!selectedAlbum && activeTab === 'home' && user && (
              <button onClick={() => setShowCreateModal(true)} className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-full border transition-all" style={{ ...bgSecondary, ...borderStyle }}>
                <Plus className="w-3.5 h-3.5" />
                <span className="text-xs">New</span>
              </button>
            )}
            
            {/* Sign in button for non-logged in users - mobile only */}
            {!selectedAlbum && !user && (
              <button onClick={() => setShowAuthModal(true)} className="lg:hidden flex items-center gap-1.5 px-4 py-2 rounded-full font-medium text-sm" style={{ backgroundColor: isDark ? '#fff' : '#000', color: isDark ? '#000' : '#fff' }}>
                Sign In
              </button>
            )}
            
            {selectedAlbum && selectedAlbum.user_id === user?.id && (
              <div className="flex items-center gap-2">
                <button onClick={openEditAlbumModal} className="flex items-center gap-1.5 px-3 py-2 rounded-full border" style={{ ...bgSecondary, ...borderStyle }}>
                  <Edit3 className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline text-xs">Edit</span>
                </button>
                <button onClick={() => setShowAddItemModal(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-full border" style={{ ...bgSecondary, ...borderStyle }}>
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline text-xs">Add Item</span>
                </button>
              </div>
            )}
            
            {selectedAlbum && selectedAlbum.user_id !== user?.id && (
              <div className="flex items-center gap-2">
                <button onClick={() => handleSave(selectedAlbum.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-full border ${savedAlbums.includes(selectedAlbum.id) ? 'bg-emerald-500/10 border-emerald-500/30' : ''}`} style={!savedAlbums.includes(selectedAlbum.id) ? { ...bgSecondary, ...borderStyle } : {}}>
                  {savedAlbums.includes(selectedAlbum.id) ? (
                    <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Bookmark className="w-3.5 h-3.5" />
                  )}
                </button>
                <button onClick={() => handleLike(selectedAlbum.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-full border ${likedAlbums.includes(selectedAlbum.id) ? 'bg-red-500/10 border-red-500/30' : ''}`} style={!likedAlbums.includes(selectedAlbum.id) ? { ...bgSecondary, ...borderStyle } : {}}>
                  <Heart className={`w-3.5 h-3.5 ${likedAlbums.includes(selectedAlbum.id) ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-lg lg:max-w-6xl mx-auto px-4 lg:px-8 py-6 pb-24 lg:pb-8">
        
        {/* Discover Tab - Available to everyone */}
        {activeTab === 'discover' && !selectedAlbum && (
          <div className="space-y-6">
            {!user && (
              <div className="text-center py-8 mb-4">
                <div className="w-20 h-20 mx-auto mb-4">
                  <TroveLogo size="xl" />
                </div>
                <h2 className="text-xl font-light mb-2">Welcome to Trove</h2>
                <p className="text-sm mb-4" style={textMuted}>Discover collections from the community</p>
              </div>
            )}
            <h2 className="text-xs font-medium uppercase tracking-wider" style={textMuted}>Explore Collections</h2>
            {publicAlbums.length === 0 ? (
              <p className="text-center py-12 text-sm" style={textMuted}>No public collections yet</p>
            ) : (
              <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
                {publicAlbums.filter(a => a.user_id !== user?.id).map(album => (
                  <AlbumCard key={album.id} album={album} showUser={true} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Home Tab - Only for logged in users */}
        {user && activeTab === 'home' && !selectedAlbum && !selectedUserProfile && (
          albums.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4" style={bgSecondary}>
                <Plus className="w-6 h-6" style={textMuted} />
              </div>
              <p className="mb-4" style={textMuted}>Your trove is empty</p>
              <button onClick={() => setShowCreateModal(true)} className="text-sm text-emerald-400">Create your first collection ✨</button>
            </div>
          ) : (
            <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
              {albums.map(album => <AlbumCard key={album.id} album={album} isOwn={true} />)}
            </div>
          )
        )}

        {/* Saved Tab - Only for logged in users */}
        {user && activeTab === 'saved' && !selectedAlbum && !selectedUserProfile && (
          <div className="space-y-6">
            <h2 className="text-xs font-medium uppercase tracking-wider" style={textMuted}>Saved Collections</h2>
            {savedAlbumsData.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4" style={bgSecondary}>
                  <Bookmark className="w-6 h-6" style={textMuted} />
                </div>
                <p className="mb-4" style={textMuted}>No saved collections yet</p>
                <button onClick={() => setActiveTab('discover')} className="text-sm text-emerald-400">Discover collections to save</button>
              </div>
            ) : (
              <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
                {savedAlbumsData.map(album => (
                  <AlbumCard key={album.id} album={album} showUser={true} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Following Tab - Only for logged in users */}
        {user && activeTab === 'following' && !selectedAlbum && !selectedUserProfile && (
          <div className="space-y-6">
            <h2 className="text-xs font-medium uppercase tracking-wider" style={textMuted}>From People You Follow</h2>
            {following.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4" style={bgSecondary}>
                  <Users className="w-6 h-6" style={textMuted} />
                </div>
                <p className="mb-4" style={textMuted}>You're not following anyone yet</p>
                <button onClick={() => setActiveTab('discover')} className="text-sm text-emerald-400">Discover people to follow</button>
              </div>
            ) : followingAlbums.length === 0 ? (
              <p className="text-center py-12 text-sm" style={textMuted}>No public collections from people you follow</p>
            ) : (
              <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
                {followingAlbums.map(album => (
                  <AlbumCard key={album.id} album={album} showUser={true} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* User Profile View */}
        {selectedUserProfile && !selectedAlbum && (
          <div className="space-y-6">
            {/* Back button */}
            <button 
              onClick={() => setSelectedUserProfile(null)} 
              className="flex items-center gap-2 text-sm"
              style={textMuted}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            
            {/* Profile Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4 lg:gap-6">
                <Avatar user={selectedUserProfile} size="xl" />
                <div>
                  <h2 className="text-xl lg:text-2xl font-medium">{selectedUserProfile.display_name || selectedUserProfile.username}</h2>
                  <p className="text-sm" style={textMuted}>@{selectedUserProfile.username}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm"><strong>{selectedUserProfile.followers_count}</strong> <span style={textMuted}>followers</span></span>
                    <span className="text-sm"><strong>{selectedUserProfile.following_count}</strong> <span style={textMuted}>following</span></span>
                  </div>
                </div>
              </div>
              
              {/* Follow Button */}
              {selectedUserProfile.id !== user?.id && (
                <button 
                  onClick={() => handleFollow(selectedUserProfile.id)} 
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-colors ${
                    following.includes(selectedUserProfile.id) 
                      ? 'border border-emerald-500/30 text-emerald-400' 
                      : ''
                  }`}
                  style={following.includes(selectedUserProfile.id) 
                    ? {} 
                    : { backgroundColor: isDark ? '#fff' : '#000', color: isDark ? '#000' : '#fff' }
                  }
                >
                  {following.includes(selectedUserProfile.id) ? (
                    <><UserCheck className="w-4 h-4" /> Following</>
                  ) : (
                    <><UserPlus className="w-4 h-4" /> Follow</>
                  )}
                </button>
              )}
            </div>
            
            {selectedUserProfile.bio && (
              <p className="text-sm lg:text-base" style={{ color: 'var(--text-secondary)' }}>{selectedUserProfile.bio}</p>
            )}
            
            {/* User's Public Collections */}
            <div className="space-y-4">
              <h3 className="text-xs font-medium uppercase tracking-wider" style={textMuted}>Public Collections</h3>
              {selectedUserProfile.albums?.length === 0 ? (
                <p className="text-center py-8 text-sm" style={textMuted}>No public collections yet</p>
              ) : (
                <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
                  {selectedUserProfile.albums?.map(album => (
                    <AlbumCard key={album.id} album={album} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Tab - Only for logged in users */}
        {user && activeTab === 'profile' && !selectedAlbum && profile && (
          <div className="space-y-6 lg:max-w-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4 lg:gap-6">
                <Avatar user={profile} size="xl" />
                <div>
                  <h2 className="text-xl lg:text-2xl font-medium">{profile.display_name || profile.username}</h2>
                  <p className="text-sm lg:text-base" style={textMuted}>@{profile.username}</p>
                </div>
              </div>
              <button onClick={() => setShowEditProfileModal(true)} className="px-3 lg:px-4 py-2 rounded-lg border text-xs lg:text-sm" style={{ ...bgSecondary, ...borderStyle }}>Edit Profile</button>
            </div>
            
            {profile.bio && <p className="text-sm lg:text-base" style={{ color: 'var(--text-secondary)' }}>{profile.bio}</p>}
            
            {/* Theme Toggle */}
            <div className="p-4 lg:p-5 rounded-xl border" style={{ ...bgSecondary, ...borderStyle }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 lg:gap-4">
                  {isDark ? <Moon className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-400" /> : <Sun className="w-5 h-5 lg:w-6 lg:h-6 text-amber-500" />}
                  <div>
                    <p className="text-sm lg:text-base font-medium">{isDark ? 'Dark Mode' : 'Light Mode'}</p>
                    <p className="text-xs lg:text-sm" style={textMuted}>{isDark ? 'Easy on the eyes' : 'Bright and clean'}</p>
                  </div>
                </div>
                <button onClick={toggleTheme} className={`relative w-14 h-8 rounded-full transition-colors ${isDark ? 'bg-emerald-600' : 'bg-amber-400'}`}>
                  <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform flex items-center justify-center ${isDark ? 'left-7' : 'left-1'}`}>
                    {isDark ? <Moon className="w-3.5 h-3.5 text-emerald-600" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                  </div>
                </button>
              </div>
            </div>
            
            {/* Sign out - hide on desktop since it's in sidebar */}
            <button onClick={handleSignOut} className="lg:hidden flex items-center gap-2 text-sm text-red-400">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        )}

        {/* Album Detail View */}
        {selectedAlbum && (
          albumItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4" style={bgSecondary}>
                <Plus className="w-6 h-6" style={textMuted} />
              </div>
              <p className="mb-4" style={textMuted}>This collection is empty</p>
              {selectedAlbum.user_id === user?.id && (
                <button onClick={() => setShowAddItemModal(true)} className="text-sm text-emerald-400">Add your first item</button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
              {albumItems.map(item => (
                <a key={item.id} href={item.link || '#'} target={item.link ? "_blank" : undefined} rel="noopener noreferrer" className="group text-left" onClick={(e) => !item.link && e.preventDefault()}>
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-2 transition-transform duration-300 group-hover:scale-[1.02]">
                    <ImageBox src={item.image_url} color={item.image_color} alt={item.title} />
                    <div className="absolute top-2 right-2 flex gap-1">
                      {item.notes && (
                        <div className="p-1.5 rounded-full bg-black/40 backdrop-blur-md">
                          <FileText className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </div>
                    {item.link && (
                      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="p-1.5 rounded-full bg-black/40 backdrop-blur-md">
                          <ExternalLink className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xs lg:text-sm font-medium line-clamp-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                  {item.notes && <p className="text-[10px] lg:text-xs line-clamp-1 mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.notes}</p>}
                </a>
              ))}
            </div>
          )
        )}
      </main>

      {/* Bottom Navigation - mobile only */}
      {!selectedAlbum && !selectedUserProfile && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl" style={{ ...bgPrimary, ...borderStyle }}>
          <div className="max-w-lg mx-auto px-4">
            <div className="flex items-center justify-around py-3">
              {user ? (
                // Logged in navigation
                [
                  { id: 'home', icon: Home, label: 'Home' },
                  { id: 'saved', icon: Bookmark, label: 'Saved' },
                  { id: 'discover', icon: Compass, label: 'Discover' },
                  { id: 'profile', icon: User, label: 'Profile' },
                ].map(tab => (
                  <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSelectedUserProfile(null) }} className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${activeTab === tab.id ? '' : 'opacity-40'}`}>
                    <tab.icon className="w-5 h-5" />
                    <span className="text-[10px]">{tab.label}</span>
                  </button>
                ))
              ) : (
                // Logged out navigation
                <>
                  <button onClick={() => setActiveTab('discover')} className="flex flex-col items-center gap-1 px-6 py-1 rounded-lg transition-colors">
                    <Compass className="w-5 h-5" />
                    <span className="text-[10px]">Discover</span>
                  </button>
                  <button onClick={() => setShowAuthModal(true)} className="flex flex-col items-center gap-1 px-6 py-1 rounded-lg transition-colors opacity-40">
                    <User className="w-5 h-5" />
                    <span className="text-[10px]">Sign In</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </nav>
      )}
      </div>{/* End of main wrapper lg:pl-64 */}

      {/* Auth Modal */}
      <Modal isOpen={showAuthModal} onClose={() => { setShowAuthModal(false); setShowEmailConfirmation(false); setShowForgotPassword(false); setShowPasswordResetSent(false); setAuthError('') }} title={showPasswordResetSent ? 'Check your inbox 📬' : (showForgotPassword ? 'Reset password' : (showEmailConfirmation ? 'Check your inbox 📬' : (isLogin ? 'Welcome back' : 'Create account')))} isDark={isDark}>
        {showPasswordResetSent ? (
          // Password reset email sent
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Check your email</h3>
            <p className="text-sm mb-4" style={textMuted}>
              We've sent a password reset link to your email address. Click the link to create a new password.
            </p>
            <p className="text-xs mb-6" style={textMuted}>
              Don't see it? Check your spam folder.
            </p>
            <button 
              onClick={() => { setShowPasswordResetSent(false); setShowForgotPassword(false); setIsLogin(true) }} 
              className="w-full py-3 rounded-lg font-medium text-sm"
              style={{ backgroundColor: isDark ? '#fff' : '#000', color: isDark ? '#000' : '#fff' }}
            >
              Back to Sign In
            </button>
          </div>
        ) : showForgotPassword ? (
          // Forgot password form
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <p className="text-sm" style={textMuted}>
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <input 
              type="email" 
              placeholder="Email" 
              value={forgotPasswordEmail} 
              onChange={(e) => setForgotPasswordEmail(e.target.value)} 
              required 
              className="w-full px-3 py-2.5 rounded-lg border text-sm" 
              style={{ ...bgSecondary, ...borderStyle, color: 'var(--text-primary)' }} 
            />
            {authError && <p className="text-red-400 text-sm">{authError}</p>}
            <button 
              type="submit" 
              disabled={saving} 
              className="w-full py-3 rounded-lg font-medium text-sm" 
              style={{ backgroundColor: isDark ? '#fff' : '#000', color: isDark ? '#000' : '#fff' }}
            >
              {saving ? 'Sending...' : 'Send Reset Link'}
            </button>
            <button 
              type="button" 
              onClick={() => { setShowForgotPassword(false); setAuthError('') }} 
              className="w-full text-sm" 
              style={textMuted}
            >
              Back to Sign In
            </button>
          </form>
        ) : showEmailConfirmation ? (
          // Email confirmation message
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Verify your email</h3>
            <p className="text-sm mb-4" style={textMuted}>
              We've sent a confirmation link to your email address. Please check your inbox and click the link to activate your account.
            </p>
            <p className="text-xs mb-6" style={textMuted}>
              Don't see it? Check your spam folder.
            </p>
            <button 
              onClick={() => { setShowEmailConfirmation(false); setIsLogin(true) }} 
              className="w-full py-3 rounded-lg font-medium text-sm"
              style={{ backgroundColor: isDark ? '#fff' : '#000', color: isDark ? '#000' : '#fff' }}
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          // Regular auth form
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <>
                <input type="text" placeholder="Username" value={authForm.username} onChange={(e) => setAuthForm({ ...authForm, username: e.target.value.replace(/\s/g, '') })} required className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ ...bgSecondary, ...borderStyle, color: 'var(--text-primary)' }} />
                <input type="text" placeholder="Display Name (optional)" value={authForm.displayName} onChange={(e) => setAuthForm({ ...authForm, displayName: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ ...bgSecondary, ...borderStyle, color: 'var(--text-primary)' }} />
              </>
            )}
            <input type="email" placeholder="Email" value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} required className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ ...bgSecondary, ...borderStyle, color: 'var(--text-primary)' }} />
            <input type="password" placeholder="Password" value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} required minLength={6} className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ ...bgSecondary, ...borderStyle, color: 'var(--text-primary)' }} />
            {authError && <p className="text-red-400 text-sm">{authError}</p>}
            <button type="submit" disabled={saving} className="w-full py-3 rounded-lg font-medium text-sm" style={{ backgroundColor: isDark ? '#fff' : '#000', color: isDark ? '#000' : '#fff' }}>
              {saving ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
            {isLogin && (
              <button 
                type="button" 
                onClick={() => { setShowForgotPassword(true); setAuthError('') }} 
                className="w-full text-sm text-emerald-400"
              >
                Forgot your password?
              </button>
            )}
            <button type="button" onClick={() => { setIsLogin(!isLogin); setAuthError('') }} className="w-full text-sm" style={textMuted}>
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </form>
        )}
      </Modal>

      {/* Create Album Modal */}
      <Modal isOpen={showCreateModal} onClose={() => { setShowCreateModal(false); removeCoverImage() }} title="Create Collection" isDark={isDark}>
        <div className="space-y-5">
          <input type="text" placeholder="Collection name" value={newAlbum.name} onChange={(e) => setNewAlbum({ ...newAlbum, name: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ ...bgSecondary, ...borderStyle, color: 'var(--text-primary)' }} />
          
          {/* Cover Image Upload */}
          <div>
            <label className="block text-xs mb-2" style={textMuted}>Cover Image</label>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverImageSelect}
              className="hidden"
            />
            {newAlbum.coverPreview ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                <img src={newAlbum.coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                <button 
                  onClick={removeCoverImage}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => coverInputRef.current?.click()}
                className="w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors hover:border-emerald-500/50"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <Camera className="w-6 h-6" style={textMuted} />
                <span className="text-xs" style={textMuted}>Upload cover image</span>
              </button>
            )}
          </div>
          
          {/* Color picker - only show if no cover image */}
          {!newAlbum.coverPreview && (
            <div>
              <label className="block text-xs mb-2" style={textMuted}>Or choose a color</label>
              <div className="flex gap-2 flex-wrap">
                {colorOptions.map(color => (
                  <button key={color} onClick={() => setNewAlbum({ ...newAlbum, coverColor: color })} className={`w-8 h-8 rounded-full ${newAlbum.coverColor === color ? 'ring-2 ring-offset-2' : ''}`} style={{ backgroundColor: color, ringColor: 'var(--text-primary)', ringOffsetColor: 'var(--bg-secondary)' }} />
                ))}
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <button onClick={() => setNewAlbum({ ...newAlbum, isPublic: false })} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border transition-all ${!newAlbum.isPublic ? 'bg-blue-500/10 border-blue-500/30' : ''}`} style={newAlbum.isPublic ? { ...bgSecondary, ...borderStyle } : {}}>
              <Lock className={`w-3.5 h-3.5 ${!newAlbum.isPublic ? 'text-blue-400' : ''}`} /><span className="text-xs">Private</span>
            </button>
            <button onClick={() => setNewAlbum({ ...newAlbum, isPublic: true })} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border transition-all ${newAlbum.isPublic ? 'bg-green-500/10 border-green-500/30' : ''}`} style={!newAlbum.isPublic ? { ...bgSecondary, ...borderStyle } : {}}>
              <Globe className={`w-3.5 h-3.5 ${newAlbum.isPublic ? 'text-green-400' : ''}`} /><span className="text-xs">Public</span>
            </button>
          </div>
          
          <button onClick={handleCreateAlbum} disabled={saving || !newAlbum.name.trim()} className="w-full py-3 rounded-lg font-medium text-sm disabled:opacity-50" style={{ backgroundColor: isDark ? '#fff' : '#000', color: isDark ? '#000' : '#fff' }}>
            {saving ? (uploadingCover ? 'Uploading cover...' : 'Creating...') : 'Create Collection ✨'}
          </button>
        </div>
      </Modal>

      {/* Add Item Modal */}
      <Modal isOpen={showAddItemModal} onClose={() => { setShowAddItemModal(false); removeItemImage() }} title="Add Item" isDark={isDark}>
        <div className="space-y-5">
          <input 
            type="text" 
            placeholder="Title" 
            value={newItem.title} 
            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} 
            className="w-full px-3 py-2.5 rounded-lg border text-sm" 
            style={{ ...bgSecondary, ...borderStyle, color: 'var(--text-primary)' }} 
          />
          
          {/* Item Image Upload */}
          <div>
            <label className="block text-xs mb-2" style={textMuted}>Image</label>
            <input
              ref={itemImageInputRef}
              type="file"
              accept="image/*"
              onChange={handleItemImageSelect}
              className="hidden"
            />
            {newItem.imagePreview ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                <img src={newItem.imagePreview} alt="Item preview" className="w-full h-full object-cover" />
                <button 
                  onClick={removeItemImage}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => itemImageInputRef.current?.click()}
                className="w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors hover:border-emerald-500/50"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <Camera className="w-6 h-6" style={textMuted} />
                <span className="text-xs" style={textMuted}>Upload image</span>
              </button>
            )}
          </div>
          
          {/* Color picker - only show if no image */}
          {!newItem.imagePreview && (
            <div>
              <label className="block text-xs mb-2" style={textMuted}>Or choose a color</label>
              <div className="flex gap-2 flex-wrap">
                {colorOptions.map(color => (
                  <button key={color} onClick={() => setNewItem({ ...newItem, imageColor: color })} className={`w-6 h-6 rounded-full ${newItem.imageColor === color ? 'ring-2 ring-offset-2' : ''}`} style={{ backgroundColor: color, ringColor: 'var(--text-primary)', ringOffsetColor: 'var(--bg-secondary)' }} />
                ))}
              </div>
            </div>
          )}
          
          <input 
            type="text" 
            placeholder="Link URL (optional)" 
            value={newItem.link} 
            onChange={(e) => setNewItem({ ...newItem, link: e.target.value })} 
            className="w-full px-3 py-2.5 rounded-lg border text-sm" 
            style={{ ...bgSecondary, ...borderStyle, color: 'var(--text-primary)' }} 
          />
          
          <textarea 
            placeholder="Notes (optional)" 
            value={newItem.notes} 
            onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })} 
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg border text-sm resize-none" 
            style={{ ...bgSecondary, ...borderStyle, color: 'var(--text-primary)' }} 
          />
          
          <button onClick={handleAddItem} disabled={saving || !newItem.title.trim()} className="w-full py-3 rounded-lg font-medium text-sm disabled:opacity-50" style={{ backgroundColor: isDark ? '#fff' : '#000', color: isDark ? '#000' : '#fff' }}>
            {saving ? (uploadingItemImage ? 'Uploading image...' : 'Adding...') : 'Add Item'}
          </button>
        </div>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal isOpen={showEditProfileModal} onClose={() => { setShowEditProfileModal(false); removeAvatarImage() }} title="Edit Profile" isDark={isDark}>
        <div className="space-y-5">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-3">
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarImageSelect}
              className="hidden"
            />
            <div className="relative">
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center font-medium text-white text-2xl overflow-hidden"
                style={{ backgroundColor: editProfile.avatar_color || '#5A67D8' }}
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                ) : profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Current avatar" className="w-full h-full object-cover" />
                ) : (
                  (profile?.display_name || profile?.username || 'U').charAt(0).toUpperCase()
                )}
              </div>
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-lg"
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            {avatarPreview && (
              <button onClick={removeAvatarImage} className="text-xs text-red-400">
                Remove new photo
              </button>
            )}
            <p className="text-xs" style={textMuted}>Tap to change photo</p>
          </div>

          <input type="text" placeholder="Display Name" value={editProfile.display_name} onChange={(e) => setEditProfile({ ...editProfile, display_name: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ ...bgSecondary, ...borderStyle, color: 'var(--text-primary)' }} />
          <textarea placeholder="Bio" value={editProfile.bio} onChange={(e) => setEditProfile({ ...editProfile, bio: e.target.value })} rows={3} className="w-full px-3 py-2.5 rounded-lg border text-sm resize-none" style={{ ...bgSecondary, ...borderStyle, color: 'var(--text-primary)' }} />
          
          <div>
            <label className="block text-xs mb-2" style={textMuted}>Avatar Color (if no photo)</label>
            <div className="flex gap-2 flex-wrap">
              {colorOptions.map(color => (
                <button key={color} onClick={() => setEditProfile({ ...editProfile, avatar_color: color })} className={`w-8 h-8 rounded-full ${editProfile.avatar_color === color ? 'ring-2 ring-offset-2' : ''}`} style={{ backgroundColor: color, ringColor: 'var(--text-primary)', ringOffsetColor: 'var(--bg-secondary)' }} />
              ))}
            </div>
          </div>
          
          <button onClick={handleUpdateProfile} disabled={saving} className="w-full py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2" style={{ backgroundColor: isDark ? '#fff' : '#000', color: isDark ? '#000' : '#fff' }}>
            {saving ? (uploadingAvatar ? 'Uploading photo...' : 'Saving...') : <><Check className="w-4 h-4" /> Save Changes</>}
          </button>
        </div>
      </Modal>

      {/* Edit Album Modal */}
      <Modal isOpen={showEditAlbumModal} onClose={() => setShowEditAlbumModal(false)} title="Edit Collection" isDark={isDark}>
        <div className="space-y-5">
          <input 
            type="text" 
            placeholder="Collection name" 
            value={editAlbum.name} 
            onChange={(e) => setEditAlbum({ ...editAlbum, name: e.target.value })} 
            className="w-full px-3 py-2.5 rounded-lg border text-sm" 
            style={{ ...bgSecondary, ...borderStyle, color: 'var(--text-primary)' }} 
          />
          
          {/* Cover Image Upload */}
          <div>
            <label className="block text-xs mb-2" style={textMuted}>Cover Image</label>
            <input
              ref={editCoverInputRef}
              type="file"
              accept="image/*"
              onChange={handleEditCoverImageSelect}
              className="hidden"
            />
            {editAlbum.coverPreview ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                <img src={editAlbum.coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                <button 
                  onClick={removeEditCoverImage}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => editCoverInputRef.current?.click()}
                className="w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors hover:border-emerald-500/50"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <Camera className="w-6 h-6" style={textMuted} />
                <span className="text-xs" style={textMuted}>Upload cover image</span>
              </button>
            )}
          </div>
          
          {/* Color picker - only show if no cover image */}
          {!editAlbum.coverPreview && (
            <div>
              <label className="block text-xs mb-2" style={textMuted}>Or choose a color</label>
              <div className="flex gap-2 flex-wrap">
                {colorOptions.map(color => (
                  <button 
                    key={color} 
                    onClick={() => setEditAlbum({ ...editAlbum, coverColor: color })} 
                    className={`w-8 h-8 rounded-full ${editAlbum.coverColor === color ? 'ring-2 ring-offset-2' : ''}`} 
                    style={{ backgroundColor: color, ringColor: 'var(--text-primary)', ringOffsetColor: 'var(--bg-secondary)' }} 
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Privacy Toggle */}
          <div className="flex gap-2">
            <button 
              onClick={() => setEditAlbum({ ...editAlbum, isPublic: false })} 
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border transition-all ${!editAlbum.isPublic ? 'bg-blue-500/10 border-blue-500/30' : ''}`} 
              style={editAlbum.isPublic ? { ...bgSecondary, ...borderStyle } : {}}
            >
              <Lock className={`w-3.5 h-3.5 ${!editAlbum.isPublic ? 'text-blue-400' : ''}`} />
              <span className="text-xs">Private</span>
            </button>
            <button 
              onClick={() => setEditAlbum({ ...editAlbum, isPublic: true })} 
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border transition-all ${editAlbum.isPublic ? 'bg-green-500/10 border-green-500/30' : ''}`} 
              style={!editAlbum.isPublic ? { ...bgSecondary, ...borderStyle } : {}}
            >
              <Globe className={`w-3.5 h-3.5 ${editAlbum.isPublic ? 'text-green-400' : ''}`} />
              <span className="text-xs">Public</span>
            </button>
          </div>
          
          <button 
            onClick={handleUpdateAlbum} 
            disabled={saving || !editAlbum.name.trim()} 
            className="w-full py-3 rounded-lg font-medium text-sm disabled:opacity-50" 
            style={{ backgroundColor: isDark ? '#fff' : '#000', color: isDark ? '#000' : '#fff' }}
          >
            {saving ? (uploadingCover ? 'Uploading cover...' : 'Saving...') : 'Save Changes'}
          </button>
          
          {/* Delete Button */}
          <button 
            onClick={handleDeleteAlbum} 
            disabled={saving}
            className="w-full py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 text-red-400 border border-red-400/30 hover:bg-red-500/10 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" /> Delete Collection
          </button>
        </div>
      </Modal>
    </div>
  )
}