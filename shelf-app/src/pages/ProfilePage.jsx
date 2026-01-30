import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Edit3, Check, Upload, Sun, Moon } from 'lucide-react'
import { useAuth } from '../lib/AuthContext'
import { useTheme } from '../lib/ThemeContext'
import { uploadImage } from '../lib/database'
import { Header, Avatar, Modal, colorOptions } from '../components/UI'

export default function ProfilePage() {
  const { profile, signOut, updateProfile } = useAuth()
  const { theme, toggleTheme, isDark } = useTheme()
  const navigate = useNavigate()
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({
    display_name: profile?.display_name || '',
    bio: profile?.bio || '',
    avatar_color: profile?.avatar_color || '#5A67D8'
  })
  const [saving, setSaving] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  
  const avatarInputRef = useRef(null)

  const handleSignOut = async () => {
    setLoggingOut(true)
    await signOut()
    navigate('/auth')
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setSaving(true)
    const { url, error } = await uploadImage(file)
    if (!error && url) {
      await updateProfile({ avatar_url: url })
    }
    setSaving(false)
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    await updateProfile({
      display_name: editForm.display_name,
      bio: editForm.bio,
      avatar_color: editForm.avatar_color
    })
    setShowEditModal(false)
    setSaving(false)
  }

  const openEditModal = () => {
    setEditForm({
      display_name: profile?.display_name || '',
      bio: profile?.bio || '',
      avatar_color: profile?.avatar_color || '#5A67D8'
    })
    setShowEditModal(true)
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="w-6 h-6 border-2 border-current opacity-30 border-t-current rounded-full animate-spin" style={{ borderTopColor: 'var(--text-primary)' }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Header 
        showLogo={true}
        rightAction={
          <button
            onClick={handleSignOut}
            disabled={loggingOut}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full border transition-all text-red-400"
            style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', borderColor: 'var(--border-color)' }}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="text-xs">{loggingOut ? '...' : 'Sign Out'}</span>
          </button>
        }
      />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar user={profile} size="xl" />
              <button 
                onClick={() => avatarInputRef.current?.click()}
                disabled={saving}
                className="absolute -bottom-1 -right-1 p-1.5 rounded-full border transition-colors"
                style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', borderColor: 'var(--border-hover)' }}
              >
                {saving ? (
                  <div className="w-3 h-3 border border-current opacity-30 border-t-current rounded-full animate-spin" />
                ) : (
                  <Edit3 className="w-3 h-3" />
                )}
              </button>
              <input
                type="file"
                ref={avatarInputRef}
                onChange={handleAvatarUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div>
              <h2 className="text-xl font-medium">{profile.display_name || profile.username}</h2>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>@{profile.username}</p>
            </div>
          </div>
          
          <button 
            onClick={openEditModal}
            className="px-3 py-2 rounded-lg border transition-colors text-xs"
            style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', borderColor: 'var(--border-color)' }}
          >
            Edit Profile
          </button>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{profile.bio}</p>
        )}

        {/* Stats */}
        <div className="flex gap-6 py-4 border-t border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="text-center">
            <p className="text-lg font-medium">0</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Albums</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-medium">0</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Followers</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-medium">0</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Following</p>
          </div>
        </div>

        {/* Appearance Setting */}
        <div className="space-y-4">
          <h3 className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Appearance</h3>
          
          <div className="flex items-center justify-between py-4 px-4 rounded-xl border" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-3">
              {isDark ? <Moon className="w-5 h-5 text-violet-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
              <div>
                <p className="text-sm font-medium">{isDark ? 'Dark Mode' : 'Light Mode'}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {isDark ? 'Easy on the eyes' : 'Bright and clean'}
                </p>
              </div>
            </div>
            
            {/* Toggle Switch */}
            <button
              onClick={toggleTheme}
              className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                isDark ? 'bg-violet-600' : 'bg-amber-400'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 flex items-center justify-center ${
                  isDark ? 'left-7' : 'left-1'
                }`}
              >
                {isDark ? (
                  <Moon className="w-3.5 h-3.5 text-violet-600" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Account Info */}
        <div className="space-y-4">
          <h3 className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Account</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Username</span>
              <span className="text-sm">@{profile.username}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Member since</span>
              <span className="text-sm">{new Date(profile.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Profile">
        <div className="space-y-5">
          <div>
            <label className="block text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Display Name</label>
            <input
              type="text"
              value={editForm.display_name}
              onChange={(e) => setEditForm({ ...editForm, display_name: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border transition-colors text-sm"
              style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>
          
          <div>
            <label className="block text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Bio</label>
            <textarea
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              rows={3}
              placeholder="Tell people about yourself..."
              className="w-full px-3 py-2.5 rounded-lg border transition-colors text-sm resize-none"
              style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label className="block text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Avatar Color</label>
            <div className="flex gap-2 flex-wrap">
              {colorOptions.map(color => (
                <button
                  key={color}
                  onClick={() => setEditForm({ ...editForm, avatar_color: color })}
                  className={`w-8 h-8 rounded-full transition-all ${editForm.avatar_color === color ? 'ring-2 ring-offset-2' : ''}`}
                  style={{ 
                    backgroundColor: color,
                    ringColor: 'var(--text-primary)',
                    ringOffsetColor: 'var(--bg-secondary)'
                  }}
                />
              ))}
            </div>
          </div>
          
          <button 
            onClick={handleSaveProfile}
            disabled={saving}
            className="w-full py-3 rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ backgroundColor: isDark ? '#ffffff' : '#000000', color: isDark ? '#000000' : '#ffffff' }}
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-current opacity-30 border-t-current rounded-full animate-spin" />
            ) : (
              <>
                <Check className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </Modal>
    </div>
  )
}
