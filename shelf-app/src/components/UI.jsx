import { Music, BookOpen, Film, Utensils, Dumbbell, Palette, Image, Globe, Lock, Heart } from 'lucide-react'

// Icon options for albums
export const iconOptions = [
  { name: 'music', icon: Music },
  { name: 'book', icon: BookOpen },
  { name: 'film', icon: Film },
  { name: 'food', icon: Utensils },
  { name: 'fitness', icon: Dumbbell },
  { name: 'art', icon: Palette },
  { name: 'image', icon: Image },
]

// Color options
export const colorOptions = [
  "#E53E3E", "#DD6B20", "#D69E2E", "#38A169", "#319795", 
  "#3182CE", "#5A67D8", "#805AD5", "#D53F8C", "#718096"
]

// Icon component
export function IconComponent({ name, className = "w-4 h-4" }) {
  const iconObj = iconOptions.find(i => i.name === name)
  if (iconObj) {
    const Icon = iconObj.icon
    return <Icon className={className} />
  }
  return <Image className={className} />
}

// Image box with fallback color
export function ImageBox({ src, color, alt, className = "" }) {
  if (src) {
    return <img src={src} alt={alt} className={`w-full h-full object-cover ${className}`} />
  }
  return (
    <div 
      className={`w-full h-full flex items-center justify-center ${className}`}
      style={{ backgroundColor: color || '#5A67D8' }}
    >
      <div className="w-1/4 h-1/4 rounded-full bg-white/10" />
    </div>
  )
}

// Avatar component
export function Avatar({ user, size = "md", className = "" }) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-xl",
    xl: "w-20 h-20 text-2xl"
  }
  
  return (
    <div 
      className={`${sizes[size]} rounded-full flex items-center justify-center font-medium text-white overflow-hidden flex-shrink-0 ${className}`}
      style={{ backgroundColor: user?.avatar_color || user?.avatarColor || '#5A67D8' }}
    >
      {user?.avatar_url || user?.avatar ? (
        <img src={user.avatar_url || user.avatar} alt={user.display_name || user.displayName} className="w-full h-full object-cover" />
      ) : (
        (user?.display_name || user?.displayName || 'U').charAt(0).toUpperCase()
      )}
    </div>
  )
}

// Album card component
export function AlbumCard({ album, onClick, isOwn = false, showUser = false, isLiked = false }) {
  const itemCount = album.items?.length ?? album.items?.[0]?.count ?? 0

  return (
    <button
      onClick={onClick}
      className="group text-left w-full"
    >
      <div className="relative aspect-square rounded-2xl overflow-hidden mb-2 transition-transform duration-300 group-hover:scale-[1.02] group-hover:shadow-lg group-hover:shadow-white/5">
        <ImageBox src={album.cover_url || album.cover} color={album.cover_color || album.coverColor} alt={album.name} />
        
        {/* Subtle glow on hover */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ boxShadow: `inset 0 0 30px ${album.cover_color || album.coverColor || '#5A67D8'}40` }}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Icon badge */}
        <div className="absolute bottom-2.5 left-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
          <div className="p-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
            <IconComponent name={album.icon} className="w-3 h-3" />
          </div>
        </div>
        
        {/* Item count & privacy */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          {isOwn && (
            <div className={`p-1 rounded-full backdrop-blur-md ${album.is_public || album.isPublic ? 'bg-green-500/20 border border-green-500/30' : 'bg-black/40 border border-white/10'}`}>
              {album.is_public || album.isPublic ? <Globe className="w-2.5 h-2.5 text-green-400" /> : <Lock className="w-2.5 h-2.5 text-white/50" />}
            </div>
          )}
          <div className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[10px] text-white/70 border border-white/5">
            {itemCount}
          </div>
        </div>

        {/* Like count for public albums */}
        {!isOwn && (album.likes_count > 0 || isLiked) && (
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/5">
            <Heart className={`w-2.5 h-2.5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white/50'}`} />
            <span className="text-[10px] text-white/70">{(album.likes_count || 0) + (isLiked ? 1 : 0)}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-xs font-medium text-white/90 group-hover:text-white transition-colors truncate">
            {album.name}
          </h3>
          {showUser && album.profiles && (
            <p className="text-[10px] text-white/40 truncate">@{album.profiles.username}</p>
          )}
        </div>
      </div>
    </button>
  )
}

// Modal component
export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm bg-neutral-900 rounded-2xl p-6 border border-white/10 animate-fade-in">
        {title && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-light">{title}</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <span className="text-xl leading-none">&times;</span>
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

// Header component
export function Header({ title, leftAction, rightAction, showLogo = false }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-black/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {leftAction}
          {showLogo ? (
            <h1 className="text-lg tracking-tight font-light">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 animate-pulse" />
                shelf
              </span>
            </h1>
          ) : (
            <h1 className="text-lg tracking-tight font-light">{title}</h1>
          )}
        </div>
        {rightAction && (
          <div className="flex items-center gap-2">
            {rightAction}
          </div>
        )}
      </div>
    </header>
  )
}
