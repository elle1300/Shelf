'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { 
  Plus, Sparkles, ExternalLink, ArrowLeft, X, Music, BookOpen, Film, 
  Utensils, Dumbbell, Palette, Image, Upload, User, Globe, Lock, 
  Heart, Search, Home, Compass, LogOut, Edit3, Check, Sun, Moon, Eye, EyeOff
} from 'lucide-react'

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
function IconComponent({ name, className = "w-4 h-4" }) {
  const iconObj = iconOptions.find(i => i.name === name)
  if (iconObj) {
    const Icon = iconObj.icon
    return <Icon className={className} />
  }
  return <Image className={className} />
}

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
        className="w-full max-w-sm rounded-2xl p-6 border animate-fade-in"
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
export default function ShelfApp() {
  // Auth state
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // App state
  const [activeTab, setActiveTab] = useState('home')
  const [albums, setAlbums] = useState([])
  const [publicAlbums, setPublicAlbums] = useState([])
  const [selectedAlbum, setSelectedAlbum] = useState(null)
  const [albumItems, setAlbumItems] = useState([])
  const [likedAlbums, setLikedAlbums] = useState([])
  
  // UI state
  const [isDark, setIsDark] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAddItemModal, setShowAddItemModal] = useState(false)
  const [showEditProfileModal, setShowEditProfileModal] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  
  // Form state
  const [authForm, setAuthForm] = useState({ email: '', password: '', username: '', displayName: '' })
  const [newAlbum, setNewAlbum] = useState({ name: '', coverColor: '#5A67D8', icon: 'music', isPublic: false })
  const [newItem, setNewItem] = useState({ title: '', link: '', imageColor: '#5A67D8' })
  const [editProfile, setEditProfile] = useState({ display_name: '', bio: '', avatar_color: '#5A67D8' })
  const [authError, setAuthError] = useState('')
  const [saving, setSaving] = useState(false)

  // Initialize
  useEffect(() => {
    const savedTheme = localStorage.getItem('shelf-theme')
    if (savedTheme) {
      setIsDark(savedTheme === 'dark')
      document.documentElement.classList.toggle('light-mode', savedTheme === 'light')
    }
    
    checkUser()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchProfile(session.user.id)
        await fetchMyAlbums(session.user.id)
        await fetchLikes(session.user.id)
      } else {
        setProfile(null)
        setAlbums([])
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    fetchPublicAlbums()
  }, [])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user ?? null)
    if (session?.user) {
      await fetchProfile(session.user.id)
      await fetchMyAlbums(session.user.id)
      await fetchLikes(session.user.id)
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
        setShowAuthModal(false)
      }
      setAuthForm({ email: '', password: '', username: '', displayName: '' })
    } catch (err) {
      setAuthError(err.message)
    }
    setSaving(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setActiveTab('home')
  }

  // Album handlers
  const handleCreateAlbum = async () => {
    if (!newAlbum.name.trim() || !user) return
    setSaving(true)
    
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

    if (!error && data) {
      setAlbums([data, ...albums])
      setShowCreateModal(false)
      setNewAlbum({ name: '', coverColor: '#5A67D8', icon: 'music', isPublic: false })
    }
    setSaving(false)
  }

  const handleAddItem = async () => {
    if (!newItem.title.trim() || !selectedAlbum || !user) return
    setSaving(true)
    
    const { data, error } = await supabase
      .from('items')
      .insert({
        album_id: selectedAlbum.id,
        user_id: user.id,
        title: newItem.title.trim(),
        link: newItem.link.trim() || null,
        image_color: newItem.imageColor
      })
      .select()
      .single()

    if (!error && data) {
      setAlbumItems([...albumItems, data])
      setShowAddItemModal(false)
      setNewItem({ title: '', link: '', imageColor: '#5A67D8' })
    }
    setSaving(false)
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

  const handleLike = async (albumId) => {
    if (!user) return
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
    const { data } = await supabase
      .from('profiles')
      .update(editProfile)
      .eq('id', user.id)
      .select()
      .single()
    if (data) setProfile(data)
    setShowEditProfileModal(false)
    setSaving(false)
  }

  // Theme handler
  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem('shelf-theme', newTheme ? 'dark' : 'light')
    document.documentElement.classList.toggle('light-mode', !newTheme)
  }

  // Album card component
  const AlbumCard = ({ album, isOwn = false, showUser = false }) => {
    const itemCount = album.items?.[0]?.count ?? 0
    const isLiked = likedAlbums.includes(album.id)
    
    return (
      <button
        onClick={() => {
          setSelectedAlbum(album)
          fetchAlbumItems(album.id)
        }}
        className="group text-left w-full"
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
        {showUser && album.profiles && (
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>@{album.profiles.username}</p>
        )}
      </button>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 animate-pulse" />
          <span className="text-lg font-light" style={{ color: 'var(--text-muted)' }}>shelf</span>
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
      {/* Header */}
      <header className="sticky top-0 z-40 border-b backdrop-blur-xl" style={{ ...bgPrimary, ...borderStyle }}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedAlbum && (
              <button onClick={() => { setSelectedAlbum(null); setAlbumItems([]) }} className="p-2 -ml-2 rounded-full hover:opacity-70">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-lg font-light">
              {selectedAlbum ? selectedAlbum.name : (
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 animate-pulse" />
                  shelf
                </span>
              )}
            </h1>
          </div>
          
          {!selectedAlbum && activeTab === 'home' && user && (
            <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-full border transition-all" style={{ ...bgSecondary, ...borderStyle }}>
              <Plus className="w-3.5 h-3.5" />
              <span className="text-xs">New</span>
            </button>
          )}
          
          {selectedAlbum && selectedAlbum.user_id === user?.id && (
            <div className="flex items-center gap-2">
              <button onClick={handleTogglePrivacy} className={`flex items-center gap-1.5 px-3 py-2 rounded-full border ${selectedAlbum.is_public ? 'bg-green-500/10 border-green-500/30' : ''}`} style={!selectedAlbum.is_public ? { ...bgSecondary, ...borderStyle } : {}}>
                {selectedAlbum.is_public ? <Globe className="w-3.5 h-3.5 text-green-400" /> : <Lock className="w-3.5 h-3.5" />}
                <span className="text-xs">{selectedAlbum.is_public ? 'Public' : 'Private'}</span>
              </button>
              <button onClick={() => setShowAddItemModal(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-full border" style={{ ...bgSecondary, ...borderStyle }}>
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          
          {selectedAlbum && selectedAlbum.user_id !== user?.id && user && (
            <button onClick={() => handleLike(selectedAlbum.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-full border ${likedAlbums.includes(selectedAlbum.id) ? 'bg-red-500/10 border-red-500/30' : ''}`} style={!likedAlbums.includes(selectedAlbum.id) ? { ...bgSecondary, ...borderStyle } : {}}>
              <Heart className={`w-3.5 h-3.5 ${likedAlbums.includes(selectedAlbum.id) ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6 pb-24">
        {/* Not logged in */}
        {!user && !selectedAlbum && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center mb-6">
              <span className="text-2xl">📚</span>
            </div>
            <h2 className="text-xl font-light mb-2">Welcome to Shelf</h2>
            <p className="text-sm mb-6" style={textMuted}>Your digital library for organizing favorites</p>
            <button onClick={() => setShowAuthModal(true)} className="px-6 py-3 rounded-full font-medium" style={{ backgroundColor: isDark ? '#fff' : '#000', color: isDark ? '#000' : '#fff' }}>
              Get Started
            </button>
          </div>
        )}

        {/* Home Tab */}
        {user && activeTab === 'home' && !selectedAlbum && (
          albums.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4" style={bgSecondary}>
                <Plus className="w-6 h-6" style={textMuted} />
              </div>
              <p className="mb-4" style={textMuted}>Your library is empty</p>
              <button onClick={() => setShowCreateModal(true)} className="text-sm text-violet-400">Create your first album</button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {albums.map(album => <AlbumCard key={album.id} album={album} isOwn={true} />)}
            </div>
          )
        )}

        {/* Discover Tab */}
        {user && activeTab === 'discover' && !selectedAlbum && (
          <div className="space-y-6">
            <h2 className="text-xs font-medium uppercase tracking-wider" style={textMuted}>Explore Albums</h2>
            {publicAlbums.length === 0 ? (
              <p className="text-center py-12 text-sm" style={textMuted}>No public albums yet</p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {publicAlbums.filter(a => a.user_id !== user?.id).map(album => (
                  <AlbumCard key={album.id} album={album} showUser={true} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {user && activeTab === 'profile' && !selectedAlbum && profile && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar user={profile} size="xl" />
                <div>
                  <h2 className="text-xl font-medium">{profile.display_name || profile.username}</h2>
                  <p className="text-sm" style={textMuted}>@{profile.username}</p>
                </div>
              </div>
              <button onClick={() => setShowEditProfileModal(true)} className="px-3 py-2 rounded-lg border text-xs" style={{ ...bgSecondary, ...borderStyle }}>Edit</button>
            </div>
            
            {profile.bio && <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{profile.bio}</p>}
            
            {/* Theme Toggle */}
            <div className="p-4 rounded-xl border" style={{ ...bgSecondary, ...borderStyle }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isDark ? <Moon className="w-5 h-5 text-violet-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                  <div>
                    <p className="text-sm font-medium">{isDark ? 'Dark Mode' : 'Light Mode'}</p>
                    <p className="text-xs" style={textMuted}>{isDark ? 'Easy on the eyes' : 'Bright and clean'}</p>
                  </div>
                </div>
                <button onClick={toggleTheme} className={`relative w-14 h-8 rounded-full transition-colors ${isDark ? 'bg-violet-600' : 'bg-amber-400'}`}>
                  <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform flex items-center justify-center ${isDark ? 'left-7' : 'left-1'}`}>
                    {isDark ? <Moon className="w-3.5 h-3.5 text-violet-600" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                  </div>
                </button>
              </div>
            </div>
            
            <button onClick={handleSignOut} className="flex items-center gap-2 text-sm text-red-400">
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
              <p className="mb-4" style={textMuted}>This album is empty</p>
              {selectedAlbum.user_id === user?.id && (
                <button onClick={() => setShowAddItemModal(true)} className="text-sm text-violet-400">Add your first item</button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {albumItems.map(item => (
                <a key={item.id} href={item.link || '#'} target={item.link ? "_blank" : undefined} rel="noopener noreferrer" className="group text-left" onClick={(e) => !item.link && e.preventDefault()}>
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-2 transition-transform duration-300 group-hover:scale-[1.02]">
                    <ImageBox src={item.image_url} color={item.image_color} alt={item.title} />
                    {item.link && (
                      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="p-1.5 rounded-full bg-black/40 backdrop-blur-md">
                          <ExternalLink className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xs font-medium line-clamp-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                </a>
              ))}
            </div>
          )
        )}
      </main>

      {/* Bottom Navigation */}
      {user && !selectedAlbum && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl" style={{ ...bgPrimary, ...borderStyle }}>
          <div className="max-w-lg mx-auto px-4">
            <div className="flex items-center justify-around py-3">
              {[
                { id: 'home', icon: Home, label: 'Home' },
                { id: 'discover', icon: Compass, label: 'Discover' },
                { id: 'profile', icon: User, label: 'Profile' },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center gap-1 px-6 py-1 rounded-lg transition-colors ${activeTab === tab.id ? '' : 'opacity-40'}`}>
                  <tab.icon className="w-5 h-5" />
                  <span className="text-[10px]">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* Auth Modal */}
      <Modal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} title={isLogin ? 'Welcome back' : 'Create account'} isDark={isDark}>
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
          <button type="button" onClick={() => { setIsLogin(!isLogin); setAuthError('') }} className="w-full text-sm" style={textMuted}>
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </form>
      </Modal>

      {/* Create Album Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Album" isDark={isDark}>
        <div className="space-y-5">
          <input type="text" placeholder="Album name" value={newAlbum.name} onChange={(e) => setNewAlbum({ ...newAlbum, name: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ ...bgSecondary, ...borderStyle, color: 'var(--text-primary)' }} />
          
          <div>
            <label className="block text-xs mb-2" style={textMuted}>Color</label>
            <div className="flex gap-2 flex-wrap">
              {colorOptions.map(color => (
                <button key={color} onClick={() => setNewAlbum({ ...newAlbum, coverColor: color })} className={`w-8 h-8 rounded-full ${newAlbum.coverColor === color ? 'ring-2 ring-offset-2' : ''}`} style={{ backgroundColor: color, ringColor: 'var(--text-primary)', ringOffsetColor: 'var(--bg-secondary)' }} />
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-xs mb-2" style={textMuted}>Icon</label>
            <div className="flex gap-1.5 flex-wrap">
              {iconOptions.map(({ name, icon: Icon }) => (
                <button key={name} onClick={() => setNewAlbum({ ...newAlbum, icon: name })} className={`p-2.5 rounded-lg border ${newAlbum.icon === name ? 'border-white/30' : ''}`} style={{ ...bgSecondary, ...borderStyle }}>
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button onClick={() => setNewAlbum({ ...newAlbum, isPublic: false })} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border ${!newAlbum.isPublic ? 'border-white/30' : ''}`} style={{ ...bgSecondary, ...borderStyle }}>
              <Lock className="w-3.5 h-3.5" /><span className="text-xs">Private</span>
            </button>
            <button onClick={() => setNewAlbum({ ...newAlbum, isPublic: true })} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border ${newAlbum.isPublic ? 'bg-green-500/10 border-green-500/30' : ''}`} style={!newAlbum.isPublic ? { ...bgSecondary, ...borderStyle } : {}}>
              <Globe className="w-3.5 h-3.5 text-green-400" /><span className="text-xs">Public</span>
            </button>
          </div>
          
          <button onClick={handleCreateAlbum} disabled={saving || !newAlbum.name.trim()} className="w-full py-3 rounded-lg font-medium text-sm disabled:opacity-50" style={{ backgroundColor: isDark ? '#fff' : '#000', color: isDark ? '#000' : '#fff' }}>
            {saving ? 'Creating...' : 'Create Album'}
          </button>
        </div>
      </Modal>

      {/* Add Item Modal */}
      <Modal isOpen={showAddItemModal} onClose={() => setShowAddItemModal(false)} title="Add Item" isDark={isDark}>
        <div className="space-y-5">
          <input type="text" placeholder="Title" value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ ...bgSecondary, ...borderStyle, color: 'var(--text-primary)' }} />
          <input type="text" placeholder="Link URL (optional)" value={newItem.link} onChange={(e) => setNewItem({ ...newItem, link: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ ...bgSecondary, ...borderStyle, color: 'var(--text-primary)' }} />
          
          <div>
            <label className="block text-xs mb-2" style={textMuted}>Color</label>
            <div className="flex gap-2 flex-wrap">
              {colorOptions.map(color => (
                <button key={color} onClick={() => setNewItem({ ...newItem, imageColor: color })} className={`w-6 h-6 rounded-full ${newItem.imageColor === color ? 'ring-2 ring-offset-2' : ''}`} style={{ backgroundColor: color, ringColor: 'var(--text-primary)', ringOffsetColor: 'var(--bg-secondary)' }} />
              ))}
            </div>
          </div>
          
          <button onClick={handleAddItem} disabled={saving || !newItem.title.trim()} className="w-full py-3 rounded-lg font-medium text-sm disabled:opacity-50" style={{ backgroundColor: isDark ? '#fff' : '#000', color: isDark ? '#000' : '#fff' }}>
            {saving ? 'Adding...' : 'Add Item'}
          </button>
        </div>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal isOpen={showEditProfileModal} onClose={() => setShowEditProfileModal(false)} title="Edit Profile" isDark={isDark}>
        <div className="space-y-5">
          <input type="text" placeholder="Display Name" value={editProfile.display_name} onChange={(e) => setEditProfile({ ...editProfile, display_name: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ ...bgSecondary, ...borderStyle, color: 'var(--text-primary)' }} />
          <textarea placeholder="Bio" value={editProfile.bio} onChange={(e) => setEditProfile({ ...editProfile, bio: e.target.value })} rows={3} className="w-full px-3 py-2.5 rounded-lg border text-sm resize-none" style={{ ...bgSecondary, ...borderStyle, color: 'var(--text-primary)' }} />
          
          <div>
            <label className="block text-xs mb-2" style={textMuted}>Avatar Color</label>
            <div className="flex gap-2 flex-wrap">
              {colorOptions.map(color => (
                <button key={color} onClick={() => setEditProfile({ ...editProfile, avatar_color: color })} className={`w-8 h-8 rounded-full ${editProfile.avatar_color === color ? 'ring-2 ring-offset-2' : ''}`} style={{ backgroundColor: color, ringColor: 'var(--text-primary)', ringOffsetColor: 'var(--bg-secondary)' }} />
              ))}
            </div>
          </div>
          
          <button onClick={handleUpdateProfile} disabled={saving} className="w-full py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2" style={{ backgroundColor: isDark ? '#fff' : '#000', color: isDark ? '#000' : '#fff' }}>
            {saving ? 'Saving...' : <><Check className="w-4 h-4" /> Save Changes</>}
          </button>
        </div>
      </Modal>
    </div>
  )
}
