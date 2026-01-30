import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, ExternalLink, Heart, Globe, Lock, Trash2, Upload } from 'lucide-react'
import { useAuth } from '../lib/AuthContext'
import { getAlbumById, getAlbumItems, createItem, updateAlbum, deleteAlbum, likeAlbum, unlikeAlbum, getUserLikes, uploadImage, deleteItem } from '../lib/database'
import { Header, ImageBox, Modal, colorOptions } from '../components/UI'

export default function AlbumPage() {
  const { albumId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [album, setAlbum] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [newItem, setNewItem] = useState({ title: '', link: '', image: null, imageColor: '#5A67D8' })
  const [saving, setSaving] = useState(false)
  
  const imageInputRef = useRef(null)

  useEffect(() => {
    loadAlbum()
  }, [albumId, user])

  const loadAlbum = async () => {
    setLoading(true)
    
    const [albumRes, itemsRes, likesRes] = await Promise.all([
      getAlbumById(albumId),
      getAlbumItems(albumId),
      user ? getUserLikes(user.id) : { data: [] }
    ])

    if (albumRes.data) {
      setAlbum(albumRes.data)
      setIsOwner(user && albumRes.data.user_id === user.id)
    }
    
    if (itemsRes.data) {
      setItems(itemsRes.data)
    }
    
    if (likesRes.data) {
      setIsLiked(likesRes.data.includes(albumId))
    }
    
    setLoading(false)
  }

  const handleTogglePrivacy = async () => {
    if (!album || !isOwner) return
    
    const { data } = await updateAlbum(albumId, { is_public: !album.is_public })
    if (data) {
      setAlbum(data)
    }
  }

  const handleToggleLike = async () => {
    if (!user || isOwner) return
    
    if (isLiked) {
      await unlikeAlbum(user.id, albumId)
      setIsLiked(false)
      setAlbum({ ...album, likes_count: Math.max(0, (album.likes_count || 0) - 1) })
    } else {
      await likeAlbum(user.id, albumId)
      setIsLiked(true)
      setAlbum({ ...album, likes_count: (album.likes_count || 0) + 1 })
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewItem({ ...newItem, image: reader.result, imageFile: file })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddItem = async () => {
    if (!newItem.title.trim() || !user) return
    
    setSaving(true)
    try {
      let imageUrl = null
      if (newItem.imageFile) {
        const { url } = await uploadImage(newItem.imageFile)
        imageUrl = url
      }

      const { data, error } = await createItem({
        album_id: albumId,
        user_id: user.id,
        title: newItem.title.trim(),
        link: newItem.link.trim() || null,
        image_url: imageUrl,
        image_color: newItem.imageColor,
        position: items.length
      })

      if (!error && data) {
        setItems([...items, data])
        setShowAddModal(false)
        setNewItem({ title: '', link: '', image: null, imageColor: '#5A67D8' })
      }
    } catch (err) {
      console.error('Error adding item:', err)
    }
    setSaving(false)
  }

  const handleDeleteAlbum = async () => {
    const { error } = await deleteAlbum(albumId)
    if (!error) {
      navigate('/')
    }
  }

  const handleDeleteItem = async (itemId) => {
    const { error } = await deleteItem(itemId)
    if (!error) {
      setItems(items.filter(i => i.id !== itemId))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  if (!album) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <p className="text-white/50 mb-4">Album not found</p>
        <button onClick={() => navigate('/')} className="text-violet-400 text-sm">
          Go home
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pb-6">
      <Header 
        title={album.name}
        leftAction={
          <button 
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        }
        rightAction={
          isOwner ? (
            <>
              <button
                onClick={handleTogglePrivacy}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full border transition-all ${
                  album.is_public 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : 'bg-white/5 border-white/10'
                }`}
              >
                {album.is_public ? <Globe className="w-3.5 h-3.5 text-green-400" /> : <Lock className="w-3.5 h-3.5" />}
                <span className="text-xs">{album.is_public ? 'Public' : 'Private'}</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="text-xs">Add</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleToggleLike}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full border transition-all ${
                isLiked
                  ? 'bg-red-500/10 border-red-500/30'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              <span className="text-xs">{album.likes_count || 0}</span>
            </button>
          )
        }
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-white/30" />
            </div>
            <p className="text-white/50 mb-4">This album is empty</p>
            {isOwner && (
              <button
                onClick={() => setShowAddModal(true)}
                className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
              >
                Add your first item
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {items.map((item) => (
              <div key={item.id} className="group relative">
                <a
                  href={item.link || '#'}
                  target={item.link ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="block text-left"
                  onClick={(e) => !item.link && e.preventDefault()}
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-2 transition-transform duration-300 group-hover:scale-[1.02]">
                    <ImageBox src={item.image_url} color={item.image_color} alt={item.title} />
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ boxShadow: `inset 0 0 30px ${item.image_color || '#5A67D8'}40` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {item.link && (
                      <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                        <div className="p-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                          <ExternalLink className="w-3 h-3" />
                        </div>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xs font-medium text-white/80 group-hover:text-white transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </a>
                
                {/* Delete button for owner */}
                {isOwner && (
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20 hover:border-red-500/30"
                  >
                    <Trash2 className="w-3 h-3 text-red-400" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Delete Album (Owner only) */}
        {isOwner && (
          <div className="mt-12 pt-6 border-t border-white/5">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Album
            </button>
          </div>
        )}
      </main>

      {/* Add Item Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Item">
        <div className="space-y-5">
          <div>
            <label className="block text-xs text-white/50 mb-2">Title</label>
            <input
              type="text"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              placeholder="Enter title..."
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/30 transition-colors text-white placeholder-white/30 text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs text-white/50 mb-2">Image</label>
            <input type="file" ref={imageInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            <div className="flex gap-3 items-start">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0" style={{ backgroundColor: newItem.imageColor }}>
                {newItem.image ? (
                  <img src={newItem.image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-white/20" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <button onClick={() => imageInputRef.current?.click()} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-xs flex items-center justify-center gap-2">
                  <Upload className="w-3.5 h-3.5" />
                  Choose Image
                </button>
                <p className="text-[10px] text-white/30 mt-2">Or pick a color:</p>
                <div className="flex gap-1 mt-1.5 flex-wrap">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      onClick={() => setNewItem({ ...newItem, imageColor: color, image: null, imageFile: null })}
                      className={`w-4 h-4 rounded-full transition-all ${newItem.imageColor === color && !newItem.image ? 'ring-2 ring-white ring-offset-1 ring-offset-neutral-900' : ''}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-white/50 mb-2">Link URL (optional)</label>
            <input
              type="text"
              value={newItem.link}
              onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/30 transition-colors text-white placeholder-white/30 text-sm"
            />
          </div>
          
          <button 
            onClick={handleAddItem}
            disabled={saving || !newItem.title.trim()}
            className="w-full py-3 rounded-lg bg-white text-black font-medium hover:bg-white/90 transition-colors text-sm disabled:opacity-50"
          >
            {saving ? 'Adding...' : 'Add Item'}
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Delete Album?">
        <div className="space-y-5">
          <p className="text-sm text-white/70">
            Are you sure you want to delete "{album.name}"? This action cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAlbum}
              className="flex-1 py-2.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
