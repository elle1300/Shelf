import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, UserPlus, UserMinus } from 'lucide-react'
import { useAuth } from '../lib/AuthContext'
import { getProfileByUsername, getUserPublicAlbums, isFollowing, followUser, unfollowUser, getUserLikes } from '../lib/database'
import { Header, Avatar, AlbumCard } from '../components/UI'

export default function UserPage() {
  const { username } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [profile, setProfile] = useState(null)
  const [albums, setAlbums] = useState([])
  const [likedAlbums, setLikedAlbums] = useState([])
  const [following, setFollowing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [followLoading, setFollowLoading] = useState(false)

  useEffect(() => {
    loadUser()
  }, [username, user])

  const loadUser = async () => {
    setLoading(true)
    
    const profileRes = await getProfileByUsername(username)
    
    if (profileRes.data) {
      setProfile(profileRes.data)
      
      // Check if this is the current user, redirect to profile
      if (user && profileRes.data.id === user.id) {
        navigate('/profile', { replace: true })
        return
      }

      const [albumsRes, followingRes, likesRes] = await Promise.all([
        getUserPublicAlbums(profileRes.data.id),
        user ? isFollowing(user.id, profileRes.data.id) : { isFollowing: false },
        user ? getUserLikes(user.id) : { data: [] }
      ])

      if (albumsRes.data) {
        setAlbums(albumsRes.data)
      }
      
      setFollowing(followingRes.isFollowing)
      
      if (likesRes.data) {
        setLikedAlbums(likesRes.data)
      }
    }
    
    setLoading(false)
  }

  const handleToggleFollow = async () => {
    if (!user || !profile) return
    
    setFollowLoading(true)
    if (following) {
      await unfollowUser(user.id, profile.id)
      setFollowing(false)
    } else {
      await followUser(user.id, profile.id)
      setFollowing(true)
    }
    setFollowLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <p className="text-white/50 mb-4">User not found</p>
        <button onClick={() => navigate('/discover')} className="text-violet-400 text-sm">
          Back to Discover
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pb-6">
      <Header 
        title={profile.display_name || profile.username}
        leftAction={
          <button 
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        }
        rightAction={
          user && (
            <button
              onClick={handleToggleFollow}
              disabled={followLoading}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full border transition-all ${
                following
                  ? 'bg-white/10 border-white/20'
                  : 'bg-violet-500/20 border-violet-500/30 hover:bg-violet-500/30'
              }`}
            >
              {followLoading ? (
                <div className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
              ) : following ? (
                <UserMinus className="w-3.5 h-3.5" />
              ) : (
                <UserPlus className="w-3.5 h-3.5 text-violet-400" />
              )}
              <span className="text-xs">{following ? 'Following' : 'Follow'}</span>
            </button>
          )
        }
      />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* User Header */}
        <div className="flex items-center gap-4">
          <Avatar user={profile} size="xl" />
          <div>
            <h2 className="text-xl font-medium">{profile.display_name || profile.username}</h2>
            <p className="text-sm text-white/50">@{profile.username}</p>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-sm text-white/70">{profile.bio}</p>
        )}

        {/* Stats */}
        <div className="flex gap-6 text-sm text-white/50">
          <span><strong className="text-white">{albums.length}</strong> public albums</span>
        </div>

        {/* Albums */}
        <div className="pt-4 border-t border-white/5">
          <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-4">Public Albums</h3>
          
          {albums.length === 0 ? (
            <p className="text-center text-white/30 text-sm py-8">No public albums</p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {albums.map((album) => (
                <AlbumCard 
                  key={album.id} 
                  album={album}
                  isLiked={likedAlbums.includes(album.id)}
                  onClick={() => navigate(`/album/${album.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
