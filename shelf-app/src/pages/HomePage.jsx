import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Sparkles, X, Upload, Lock, Globe } from 'lucide-react'
import { useAuth } from '../lib/AuthContext'
import { getMyAlbums, createAlbum, uploadImage } from '../lib/database'
import { Header, AlbumCard, Modal, iconOptions, colorOptions, IconComponent } from '../components/UI'

export default function HomePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAIModal, setShowAIModal] = useState(false)
  const [newAlbum, setNewAlbum] = useState({ 
    name: '', 
    cover: null, 
    coverColor: '#5A67D8', 
    icon: 'music', 
    isPublic: false 
  })
  const [creating, setCreating] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiGenerating, setAiGenerating] = useState(false)
  const [aiResult, setAiResult] = useState(null)
  
  const coverInputRef = useRef(null)

  useEffect(() => {
    loadAlbums()
  }, [user])

  const loadAlbums = async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await getMyAlbums(user.id)
    if (!error && data) {
      setAlbums(data)
    }
    setLoading(false)
  }

  const handleCoverUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewAlbum({ ...newAlbum, cover: reader.result, coverFile: file })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCreateAlbum = async () => {
    if (!newAlbum.name.trim() || !user) return
    
    setCreating(true)
    try {
      let coverUrl = null
      if (newAlbum.coverFile) {
        const { url } = await uploadImage(newAlbum.coverFile)
        coverUrl = url
      }

      const { data, error } = await createAlbum({
        user_id: user.id,
        name: newAlbum.name.trim(),
        cover_url: coverUrl,
        cover_color: newAlbum.coverColor,
        icon: newAlbum.icon,
        is_public: newAlbum.isPublic
      })

      if (!error && data) {
        setAlbums([data, ...albums])
        setShowCreateModal(false)
        setNewAlbum({ name: '', cover: null, coverColor: '#5A67D8', icon: 'music', isPublic: false })
      }
    } catch (err) {
      console.error('Error creating album:', err)
    }
    setCreating(false)
  }

  const aiSuggestions = {
    "workout": { name: "Workout Routines", icon: "fitness", items: ["Push Day", "Pull Day", "Leg Day", "Cardio"] },
    "gym": { name: "Gym Routines", icon: "fitness", items: ["Upper Body", "Lower Body", "Core", "HIIT"] },
    "recipes": { name: "Recipe Collection", icon: "food", items: ["Breakfast", "Lunch", "Dinner", "Desserts"] },
    "music": { name: "Music Playlists", icon: "music", items: ["Chill Vibes", "Workout Mix", "Focus Mode", "Party"] },
    "movies": { name: "Watch List", icon: "film", items: ["Must Watch", "Classics", "New Releases", "Documentaries"] },
    "books": { name: "Reading List", icon: "book", items: ["Fiction", "Non-Fiction", "Self-Help", "Biographies"] },
  }

  const handleAIGenerate = () => {
    setAiGenerating(true)
    setTimeout(() => {
      const promptLower = aiPrompt.toLowerCase()
      let result = null
      
      for (const [key, value] of Object.entries(aiSuggestions)) {
        if (promptLower.includes(key)) {
          result = value
          break
        }
      }
      
      if (!result) {
        result = {
          name: aiPrompt.slice(0, 30),
          icon: 'image',
          items: ["Item 1", "Item 2", "Item 3"]
        }
      }
      
      setAiResult(result)
      setAiGenerating(false)
    }, 1500)
  }

  const handleAcceptAI = async () => {
    if (!aiResult || !user) return
    
    setCreating(true)
    const { data, error } = await createAlbum({
      user_id: user.id,
      name: aiResult.name,
      cover_color: colorOptions[Math.floor(Math.random() * colorOptions.length)],
      icon: aiResult.icon,
      is_public: false
    })

    if (!error && data) {
      setAlbums([data, ...albums])
      setShowAIModal(false)
      setAiPrompt('')
      setAiResult(null)
      // Navigate to the new album to add items
      navigate(`/album/${data.id}`)
    }
    setCreating(false)
  }

  return (
    <div className="min-h-screen bg-black">
      <Header 
        showLogo={true}
        rightAction={
          <>
            <button
              onClick={() => setShowAIModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 hover:border-violet-400/50 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-xs text-violet-300">AI</span>
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="text-xs">New</span>
            </button>
          </>
        }
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        ) : albums.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-white/30" />
            </div>
            <p className="text-white/50 mb-4">Your library is empty</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
            >
              Create your first album
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {albums.map((album) => (
              <AlbumCard 
                key={album.id} 
                album={album} 
                isOwn={true}
                onClick={() => navigate(`/album/${album.id}`)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create Album Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Album">
        <div className="space-y-5">
          <div>
            <label className="block text-xs text-white/50 mb-2">Album Name</label>
            <input
              type="text"
              value={newAlbum.name}
              onChange={(e) => setNewAlbum({ ...newAlbum, name: e.target.value })}
              placeholder="My Favorites"
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/30 transition-colors text-white placeholder-white/30 text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs text-white/50 mb-2">Cover Image</label>
            <input type="file" ref={coverInputRef} onChange={handleCoverUpload} accept="image/*" className="hidden" />
            <div className="flex gap-3 items-start">
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0" style={{ backgroundColor: newAlbum.coverColor }}>
                {newAlbum.cover ? (
                  <img src={newAlbum.cover} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-white/20" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <button onClick={() => coverInputRef.current?.click()} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-xs flex items-center justify-center gap-2">
                  <Upload className="w-3.5 h-3.5" />
                  Choose Image
                </button>
                <p className="text-[10px] text-white/30 mt-2">Or pick a color:</p>
                <div className="flex gap-1 mt-1.5 flex-wrap">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      onClick={() => setNewAlbum({ ...newAlbum, coverColor: color, cover: null, coverFile: null })}
                      className={`w-5 h-5 rounded-full transition-all ${newAlbum.coverColor === color && !newAlbum.cover ? 'ring-2 ring-white ring-offset-1 ring-offset-neutral-900' : ''}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-white/50 mb-2">Category Icon</label>
            <div className="flex gap-1.5 flex-wrap">
              {iconOptions.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  onClick={() => setNewAlbum({ ...newAlbum, icon: name })}
                  className={`p-2.5 rounded-lg border transition-all ${newAlbum.icon === name ? 'bg-white/10 border-white/30' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/50 mb-2">Visibility</label>
            <div className="flex gap-2">
              <button
                onClick={() => setNewAlbum({ ...newAlbum, isPublic: false })}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border transition-all ${!newAlbum.isPublic ? 'bg-white/10 border-white/30' : 'bg-white/5 border-white/10'}`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="text-xs">Private</span>
              </button>
              <button
                onClick={() => setNewAlbum({ ...newAlbum, isPublic: true })}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border transition-all ${newAlbum.isPublic ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}
              >
                <Globe className="w-3.5 h-3.5 text-green-400" />
                <span className="text-xs">Public</span>
              </button>
            </div>
          </div>
          
          <button 
            onClick={handleCreateAlbum} 
            disabled={creating || !newAlbum.name.trim()}
            className="w-full py-3 rounded-lg bg-white text-black font-medium hover:bg-white/90 transition-colors text-sm disabled:opacity-50"
          >
            {creating ? 'Creating...' : 'Create Album'}
          </button>
        </div>
      </Modal>

      {/* AI Modal */}
      <Modal isOpen={showAIModal} onClose={() => { setShowAIModal(false); setAiResult(null); setAiPrompt(''); }} title="AI Creator">
        {!aiResult ? (
          <div className="space-y-5">
            <div>
              <label className="block text-xs text-white/50 mb-2">Describe your album</label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g., workout routines, recipes, music playlists..."
                rows={3}
                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-violet-500/50 transition-colors text-white placeholder-white/30 resize-none text-sm"
              />
            </div>
            
            <div className="flex flex-wrap gap-1.5">
              {['gym routines', 'recipes', 'music', 'movies', 'books'].map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => setAiPrompt(suggestion)}
                  className="px-2.5 py-1 rounded-full text-[10px] bg-white/5 border border-white/10 hover:border-white/20 text-white/60 transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
            
            <button
              onClick={handleAIGenerate}
              disabled={!aiPrompt || aiGenerating}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              {aiGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate Album
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <h3 className="font-medium text-sm mb-3">{aiResult.name}</h3>
              <div className="flex flex-wrap gap-2">
                {aiResult.items.map((item, idx) => (
                  <span key={idx} className="px-2 py-1 rounded-full text-[10px] bg-white/10 text-white/70">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <button onClick={() => setAiResult(null)} className="flex-1 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm">
                Try Again
              </button>
              <button onClick={handleAcceptAI} disabled={creating} className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-medium hover:opacity-90 transition-opacity text-sm disabled:opacity-50">
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
