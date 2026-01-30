import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useAuth } from '../lib/AuthContext'
import { getPublicAlbums, getUserLikes, searchAlbums, searchProfiles } from '../lib/database'
import { Header, AlbumCard, Avatar } from '../components/UI'

export default function DiscoverPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [albums, setAlbums] = useState([])
  const [featuredUsers, setFeaturedUsers] = useState([])
  const [likedAlbums, setLikedAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState({ albums: [], profiles: [] })
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    loadData()
  }, [user])

  const loadData = async () => {
    setLoading(true)
    
    const [albumsRes, likesRes] = await Promise.all([
      getPublicAlbums(20),
      user ? getUserLikes(user.id) : { data: [] }
    ])

    if (albumsRes.data) {
      setAlbums(albumsRes.data)
      // Extract unique users for featured section
      const uniqueUsers = []
      const seenIds = new Set()
      albumsRes.data.forEach(album => {
        if (album.profiles && !seenIds.has(album.profiles.id)) {
          seenIds.add(album.profiles.id)
          uniqueUsers.push(album.profiles)
        }
      })
      setFeaturedUsers(uniqueUsers.slice(0, 6))
    }
    
    if (likesRes.data) {
      setLikedAlbums(likesRes.data)
    }
    
    setLoading(false)
  }

  const handleSearch = async (query) => {
    setSearchQuery(query)
    
    if (!query.trim()) {
      setSearchResults({ albums: [], profiles: [] })
      return
    }

    setSearching(true)
    const [albumsRes, profilesRes] = await Promise.all([
      searchAlbums(query),
      searchProfiles(query)
    ])

    setSearchResults({
      albums: albumsRes.data || [],
      profiles: profilesRes.data || []
    })
    setSearching(false)
  }

  const displayAlbums = searchQuery.trim() ? searchResults.albums : albums
  const displayProfiles = searchQuery.trim() ? searchResults.profiles : featuredUsers

  return (
    <div className="min-h-screen bg-black">
      <Header showLogo={true} />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search albums or users..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-white/20 transition-colors text-sm placeholder-white/30"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Featured Users / Search Results */}
            {displayProfiles.length > 0 && (
              <div>
                <h2 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3">
                  {searchQuery.trim() ? 'Users' : 'Featured Curators'}
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4">
                  {displayProfiles.map(profile => (
                    <button
                      key={profile.id}
                      onClick={() => navigate(`/user/${profile.username}`)}
                      className="flex flex-col items-center gap-2 min-w-[80px] group"
                    >
                      <div className="relative">
                        <Avatar user={profile} size="lg" />
                        <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-white/20 transition-colors" />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-medium text-white/80 group-hover:text-white transition-colors truncate max-w-[80px]">
                          {(profile.display_name || profile.username || '').split(' ')[0]}
                        </p>
                        <p className="text-[10px] text-white/40">@{profile.username}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Albums */}
            <div>
              <h2 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3">
                {searchQuery.trim() ? 'Albums' : 'Explore Albums'}
              </h2>
              
              {displayAlbums.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-white/40 text-sm">
                    {searchQuery.trim() ? 'No albums found' : 'No public albums yet'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {displayAlbums.map((album) => (
                    <AlbumCard 
                      key={album.id} 
                      album={album} 
                      showUser={true}
                      isLiked={likedAlbums.includes(album.id)}
                      onClick={() => navigate(`/album/${album.id}`)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
