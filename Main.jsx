import React, { useState, useRef } from 'react';
import { Plus, Sparkles, ExternalLink, ArrowLeft, X, Music, BookOpen, Film, Utensils, Dumbbell, Palette, Image, Upload, User, Globe, Lock, Heart, Search, Home, Compass, Settings, LogOut, Edit3, Check } from 'lucide-react';

// Current user
const currentUser = {
  id: 1,
  username: "you",
  displayName: "Your Library",
  avatar: null,
  avatarColor: "#5A67D8",
  bio: "Collecting my favorite things ✨",
  followers: 12,
  following: 8
};

// Sample users for discover
const sampleUsers = [
  {
    id: 2,
    username: "sarah_bakes",
    displayName: "Sarah Chen",
    avatar: null,
    avatarColor: "#D53F8C",
    bio: "Baker & recipe collector 🧁",
    followers: 234,
    following: 89
  },
  {
    id: 3,
    username: "fitlife_mike",
    displayName: "Mike Torres",
    avatar: null,
    avatarColor: "#38A169",
    bio: "Fitness enthusiast. Sharing my workout splits.",
    followers: 1420,
    following: 156
  },
  {
    id: 4,
    username: "vinyl_jordan",
    displayName: "Jordan Lee",
    avatar: null,
    avatarColor: "#DD6B20",
    bio: "Music is life. Curating the perfect playlists.",
    followers: 567,
    following: 234
  }
];

// Sample data for demo
const initialAlbums = [
  {
    id: 1,
    userId: 1,
    name: "Chill Vibes",
    cover: null,
    coverColor: "#1DB954",
    icon: "music",
    isPublic: true,
    likes: 24,
    items: [
      { id: 1, title: "Lo-Fi Beats to Study", image: null, imageColor: "#2D46B9", link: "https://open.spotify.com" },
      { id: 2, title: "Rainy Day Jazz", image: null, imageColor: "#4A5568", link: "https://open.spotify.com" },
      { id: 3, title: "Sunday Morning Acoustic", image: null, imageColor: "#D69E2E", link: "https://open.spotify.com" },
    ]
  },
  {
    id: 2,
    userId: 1,
    name: "Baking Recipes",
    cover: null,
    coverColor: "#F6AD55",
    icon: "food",
    isPublic: false,
    likes: 0,
    items: [
      { id: 1, title: "Vegan Lemon Blueberry Muffins", image: null, imageColor: "#9F7AEA", link: "https://example.com/recipe1" },
      { id: 2, title: "Chocolate Sourdough Babka", image: null, imageColor: "#744210", link: "https://example.com/recipe2" },
      { id: 3, title: "Classic French Croissants", image: null, imageColor: "#ECC94B", link: "https://example.com/recipe3" },
    ]
  },
  {
    id: 3,
    userId: 1,
    name: "Gym Routines",
    cover: null,
    coverColor: "#FF6B6B",
    icon: "fitness",
    isPublic: true,
    likes: 89,
    items: [
      { id: 1, title: "Push Day - Chest & Triceps", image: null, imageColor: "#E53E3E", link: "https://www.muscleandstrength.com/workouts/push-pull-legs-workout" },
      { id: 2, title: "Pull Day - Back & Biceps", image: null, imageColor: "#3182CE", link: "https://www.muscleandstrength.com/workouts/push-pull-legs-workout" },
      { id: 3, title: "Leg Day - Quads & Glutes", image: null, imageColor: "#38A169", link: "https://www.muscleandstrength.com/workouts/push-pull-legs-workout" },
      { id: 4, title: "HIIT Cardio Blast", image: null, imageColor: "#DD6B20", link: "https://www.fitnessblender.com/videos/hiit-cardio-workout" },
      { id: 5, title: "Core & Abs Burner", image: null, imageColor: "#805AD5", link: "https://www.youtube.com/watch?v=AnYl6Nk9GOA" },
      { id: 6, title: "Full Body Strength", image: null, imageColor: "#D69E2E", link: "https://www.nerdfitness.com/blog/beginner-body-weight-workout-burn-fat-build-muscle/" },
    ]
  },
];

// Public albums from other users
const publicAlbums = [
  {
    id: 101,
    userId: 2,
    user: sampleUsers[0],
    name: "Sourdough Journey",
    cover: null,
    coverColor: "#D69E2E",
    icon: "food",
    isPublic: true,
    likes: 342,
    items: [
      { id: 1, title: "Basic Sourdough Loaf", image: null, imageColor: "#B7791F", link: "#" },
      { id: 2, title: "Sourdough Discard Crackers", image: null, imageColor: "#744210", link: "#" },
      { id: 3, title: "Chocolate Babka", image: null, imageColor: "#5D4037", link: "#" },
    ]
  },
  {
    id: 102,
    userId: 3,
    user: sampleUsers[1],
    name: "PPL Split",
    cover: null,
    coverColor: "#38A169",
    icon: "fitness",
    isPublic: true,
    likes: 1205,
    items: [
      { id: 1, title: "Push A - Heavy", image: null, imageColor: "#E53E3E", link: "#" },
      { id: 2, title: "Pull A - Heavy", image: null, imageColor: "#3182CE", link: "#" },
      { id: 3, title: "Legs A - Quad Focus", image: null, imageColor: "#38A169", link: "#" },
      { id: 4, title: "Push B - Volume", image: null, imageColor: "#ED64A6", link: "#" },
      { id: 5, title: "Pull B - Volume", image: null, imageColor: "#319795", link: "#" },
      { id: 6, title: "Legs B - Ham/Glute Focus", image: null, imageColor: "#805AD5", link: "#" },
    ]
  },
  {
    id: 103,
    userId: 4,
    user: sampleUsers[2],
    name: "Late Night Drives",
    cover: null,
    coverColor: "#5A67D8",
    icon: "music",
    isPublic: true,
    likes: 456,
    items: [
      { id: 1, title: "Synthwave Essentials", image: null, imageColor: "#9F7AEA", link: "#" },
      { id: 2, title: "Midnight Jazz", image: null, imageColor: "#2D3748", link: "#" },
      { id: 3, title: "Chill Electronic", image: null, imageColor: "#319795", link: "#" },
    ]
  },
  {
    id: 104,
    userId: 4,
    user: sampleUsers[2],
    name: "Vinyl Classics",
    cover: null,
    coverColor: "#DD6B20",
    icon: "music",
    isPublic: true,
    likes: 789,
    items: [
      { id: 1, title: "70s Rock Legends", image: null, imageColor: "#C05621", link: "#" },
      { id: 2, title: "80s New Wave", image: null, imageColor: "#D53F8C", link: "#" },
      { id: 3, title: "90s Alternative", image: null, imageColor: "#5A67D8", link: "#" },
      { id: 4, title: "Jazz Standards", image: null, imageColor: "#2D3748", link: "#" },
    ]
  },
];

const iconOptions = [
  { name: 'music', icon: Music },
  { name: 'book', icon: BookOpen },
  { name: 'film', icon: Film },
  { name: 'food', icon: Utensils },
  { name: 'fitness', icon: Dumbbell },
  { name: 'art', icon: Palette },
  { name: 'image', icon: Image },
];

const colorOptions = [
  "#E53E3E", "#DD6B20", "#D69E2E", "#38A169", "#319795", 
  "#3182CE", "#5A67D8", "#805AD5", "#D53F8C", "#718096"
];

const aiSuggestions = {
  "workout playlists": {
    name: "Workout Playlists",
    icon: "fitness",
    items: [
      { title: "Beast Mode - Heavy Lifting", imageColor: "#E53E3E" },
      { title: "Cardio Pop Hits", imageColor: "#D53F8C" },
      { title: "Morning Run Motivation", imageColor: "#DD6B20" },
      { title: "Yoga & Meditation", imageColor: "#319795" },
    ]
  },
  "italian recipes": {
    name: "Italian Recipes",
    icon: "food",
    items: [
      { title: "Classic Carbonara", imageColor: "#D69E2E" },
      { title: "Homemade Margherita Pizza", imageColor: "#E53E3E" },
      { title: "Tiramisu", imageColor: "#744210" },
      { title: "Fresh Pasta Dough", imageColor: "#F6AD55" },
    ]
  },
  "gym": {
    name: "Workout Routines",
    icon: "fitness",
    items: [
      { title: "Upper Body Strength", imageColor: "#E53E3E" },
      { title: "Lower Body Power", imageColor: "#3182CE" },
      { title: "Core Stability", imageColor: "#38A169" },
      { title: "Flexibility & Mobility", imageColor: "#805AD5" },
    ]
  }
};

export default function DigitalLibrary() {
  const [albums, setAlbums] = useState(initialAlbums);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [newAlbum, setNewAlbum] = useState({ name: '', cover: null, coverColor: '#5A67D8', icon: 'music', isPublic: false });
  const [newItem, setNewItem] = useState({ title: '', image: null, imageColor: '#5A67D8', link: '' });
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [likedAlbums, setLikedAlbums] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingUser, setViewingUser] = useState(null);
  const [profile, setProfile] = useState(currentUser);
  
  const albumCoverInputRef = useRef(null);
  const itemImageInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'album') {
          setNewAlbum({ ...newAlbum, cover: reader.result });
        } else if (type === 'item') {
          setNewItem({ ...newItem, image: reader.result });
        } else if (type === 'avatar') {
          setProfile({ ...profile, avatar: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateAlbum = () => {
    if (newAlbum.name) {
      const album = {
        id: Date.now(),
        userId: 1,
        name: newAlbum.name,
        cover: newAlbum.cover,
        coverColor: newAlbum.coverColor,
        icon: newAlbum.icon,
        isPublic: newAlbum.isPublic,
        likes: 0,
        items: []
      };
      setAlbums([...albums, album]);
      setNewAlbum({ name: '', cover: null, coverColor: '#5A67D8', icon: 'music', isPublic: false });
      setShowCreateModal(false);
    }
  };

  const handleAddItem = () => {
    if (newItem.title && selectedAlbum) {
      const updatedAlbums = albums.map(album => {
        if (album.id === selectedAlbum.id) {
          return {
            ...album,
            items: [...album.items, {
              id: Date.now(),
              title: newItem.title,
              image: newItem.image,
              imageColor: newItem.imageColor,
              link: newItem.link || '#'
            }]
          };
        }
        return album;
      });
      setAlbums(updatedAlbums);
      setSelectedAlbum(updatedAlbums.find(a => a.id === selectedAlbum.id));
      setNewItem({ title: '', image: null, imageColor: '#5A67D8', link: '' });
      setShowAddItemModal(false);
    }
  };

  const handleAIGenerate = () => {
    setAiGenerating(true);
    setTimeout(() => {
      const promptLower = aiPrompt.toLowerCase();
      let result = null;
      for (const [key, value] of Object.entries(aiSuggestions)) {
        if (promptLower.includes(key) || key.split(' ').some(word => promptLower.includes(word))) {
          result = value;
          break;
        }
      }
      if (!result) {
        result = {
          name: aiPrompt.slice(0, 30),
          icon: 'image',
          items: [
            { title: "Suggested Item 1", imageColor: "#5A67D8" },
            { title: "Suggested Item 2", imageColor: "#D53F8C" },
            { title: "Suggested Item 3", imageColor: "#38A169" },
          ]
        };
      }
      setAiResult(result);
      setAiGenerating(false);
    }, 1500);
  };

  const handleAcceptAI = () => {
    if (aiResult) {
      const album = {
        id: Date.now(),
        userId: 1,
        name: aiResult.name,
        cover: null,
        coverColor: aiResult.items[0]?.imageColor || "#5A67D8",
        icon: aiResult.icon,
        isPublic: false,
        likes: 0,
        items: aiResult.items.map((item, idx) => ({
          id: Date.now() + idx,
          title: item.title,
          image: null,
          imageColor: item.imageColor,
          link: '#'
        }))
      };
      setAlbums([...albums, album]);
      setAiPrompt('');
      setAiResult(null);
      setShowAIModal(false);
    }
  };

  const toggleLike = (albumId) => {
    if (likedAlbums.includes(albumId)) {
      setLikedAlbums(likedAlbums.filter(id => id !== albumId));
    } else {
      setLikedAlbums([...likedAlbums, albumId]);
    }
  };

  const toggleAlbumPrivacy = (albumId) => {
    setAlbums(albums.map(album => 
      album.id === albumId ? { ...album, isPublic: !album.isPublic } : album
    ));
  };

  const IconComponent = ({ name, className }) => {
    const iconObj = iconOptions.find(i => i.name === name);
    if (iconObj) {
      const Icon = iconObj.icon;
      return <Icon className={className} />;
    }
    return <Image className={className} />;
  };

  const ImageBox = ({ src, color, alt, className = "" }) => {
    if (src) {
      return <img src={src} alt={alt} className={`w-full h-full object-cover ${className}`} />;
    }
    return (
      <div 
        className={`w-full h-full flex items-center justify-center ${className}`}
        style={{ backgroundColor: color || '#5A67D8' }}
      >
        <div className="w-1/4 h-1/4 rounded-full bg-white/10" />
      </div>
    );
  };

  const Avatar = ({ user, size = "md" }) => {
    const sizes = {
      sm: "w-8 h-8 text-xs",
      md: "w-10 h-10 text-sm",
      lg: "w-16 h-16 text-xl"
    };
    return (
      <div 
        className={`${sizes[size]} rounded-full flex items-center justify-center font-medium text-white overflow-hidden`}
        style={{ backgroundColor: user.avatarColor }}
      >
        {user.avatar ? (
          <img src={user.avatar} alt={user.displayName} className="w-full h-full object-cover" />
        ) : (
          user.displayName.charAt(0).toUpperCase()
        )}
      </div>
    );
  };

  const AlbumCard = ({ album, isOwn = false, showUser = false }) => (
    <button
      onClick={() => {
        setSelectedAlbum(album);
        if (showUser && album.user) setViewingUser(album.user);
      }}
      className="group text-left w-full"
    >
      <div className="relative aspect-square rounded-2xl overflow-hidden mb-2 transition-transform duration-300 group-hover:scale-[1.02] group-hover:shadow-lg group-hover:shadow-white/5">
        <ImageBox src={album.cover} color={album.coverColor} alt={album.name} />
        
        {/* Subtle glow on hover */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ 
            boxShadow: `inset 0 0 30px ${album.coverColor}40`,
          }}
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
            <div className={`p-1 rounded-full backdrop-blur-md ${album.isPublic ? 'bg-green-500/20 border border-green-500/30' : 'bg-black/40 border border-white/10'}`}>
              {album.isPublic ? <Globe className="w-2.5 h-2.5 text-green-400" /> : <Lock className="w-2.5 h-2.5 text-white/50" />}
            </div>
          )}
          <div className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[10px] text-white/70 border border-white/5">
            {album.items.length}
          </div>
        </div>

        {/* Like count for public albums */}
        {!isOwn && album.likes > 0 && (
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/5">
            <Heart className={`w-2.5 h-2.5 ${likedAlbums.includes(album.id) ? 'fill-red-500 text-red-500' : 'text-white/50'}`} />
            <span className="text-[10px] text-white/70">{album.likes + (likedAlbums.includes(album.id) ? 1 : 0)}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-xs font-medium text-white/90 group-hover:text-white transition-colors truncate">
            {album.name}
          </h3>
          {showUser && album.user && (
            <p className="text-[10px] text-white/40 truncate">@{album.user.username}</p>
          )}
        </div>
      </div>
    </button>
  );

  const filteredPublicAlbums = publicAlbums.filter(album => 
    album.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    album.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    album.user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen text-white font-sans" style={{ backgroundColor: '#000000' }}>
      
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5" style={{ backgroundColor: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {(selectedAlbum || viewingUser) && (
              <button 
                onClick={() => {
                  if (selectedAlbum) setSelectedAlbum(null);
                  if (viewingUser && !selectedAlbum) setViewingUser(null);
                  if (viewingUser && selectedAlbum) setSelectedAlbum(null);
                }}
                className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-lg tracking-tight font-light">
              {selectedAlbum ? selectedAlbum.name : viewingUser ? viewingUser.displayName : (
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 animate-pulse" />
                  shelf
                </span>
              )}
            </h1>
          </div>
          
          {!selectedAlbum && !viewingUser && activeTab === 'home' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAIModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 hover:border-violet-400/50 hover:from-violet-600/30 hover:to-fuchsia-600/30 transition-all group"
              >
                <Sparkles className="w-3.5 h-3.5 text-violet-400 group-hover:text-violet-300" />
                <span className="text-xs text-violet-300 group-hover:text-violet-200">AI</span>
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="text-xs">New</span>
              </button>
            </div>
          )}
          
          {selectedAlbum && selectedAlbum.userId === 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleAlbumPrivacy(selectedAlbum.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full border transition-all ${
                  selectedAlbum.isPublic 
                    ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                {selectedAlbum.isPublic ? <Globe className="w-3.5 h-3.5 text-green-400" /> : <Lock className="w-3.5 h-3.5" />}
                <span className="text-xs">{selectedAlbum.isPublic ? 'Public' : 'Private'}</span>
              </button>
              <button
                onClick={() => setShowAddItemModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="text-xs">Add</span>
              </button>
            </div>
          )}

          {selectedAlbum && selectedAlbum.userId !== 1 && (
            <button
              onClick={() => toggleLike(selectedAlbum.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full border transition-all ${
                likedAlbums.includes(selectedAlbum.id)
                  ? 'bg-red-500/10 border-red-500/30'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${likedAlbums.includes(selectedAlbum.id) ? 'fill-red-500 text-red-500' : ''}`} />
              <span className="text-xs">{likedAlbums.includes(selectedAlbum.id) ? 'Liked' : 'Like'}</span>
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 pb-24">
        
        {/* Home Tab - Your Albums */}
        {activeTab === 'home' && !selectedAlbum && !viewingUser && (
          <div className="grid grid-cols-3 gap-3">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} isOwn={true} />
            ))}
          </div>
        )}

        {/* Discover Tab */}
        {activeTab === 'discover' && !selectedAlbum && !viewingUser && (
          <div className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search albums or users..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-white/20 focus:outline-none transition-colors text-sm placeholder-white/30"
              />
            </div>

            {/* Featured Users */}
            <div>
              <h2 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3">Featured Curators</h2>
              <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4">
                {sampleUsers.map(user => (
                  <button
                    key={user.id}
                    onClick={() => setViewingUser(user)}
                    className="flex flex-col items-center gap-2 min-w-[80px] group"
                  >
                    <div className="relative">
                      <Avatar user={user} size="lg" />
                      <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-white/20 transition-colors" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-medium text-white/80 group-hover:text-white transition-colors truncate max-w-[80px]">{user.displayName.split(' ')[0]}</p>
                      <p className="text-[10px] text-white/40">{user.followers} followers</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Public Albums */}
            <div>
              <h2 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3">Explore Albums</h2>
              <div className="grid grid-cols-3 gap-3">
                {filteredPublicAlbums.map((album) => (
                  <AlbumCard key={album.id} album={album} showUser={true} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Viewing another user's profile */}
        {viewingUser && !selectedAlbum && (
          <div className="space-y-6">
            {/* User Header */}
            <div className="flex items-center gap-4">
              <Avatar user={viewingUser} size="lg" />
              <div className="flex-1">
                <h2 className="text-lg font-medium">{viewingUser.displayName}</h2>
                <p className="text-xs text-white/50">@{viewingUser.username}</p>
                <p className="text-xs text-white/70 mt-1">{viewingUser.bio}</p>
              </div>
            </div>
            
            <div className="flex gap-4 text-xs text-white/50">
              <span><strong className="text-white">{viewingUser.followers}</strong> followers</span>
              <span><strong className="text-white">{viewingUser.following}</strong> following</span>
            </div>

            {/* User's public albums */}
            <div className="grid grid-cols-3 gap-3">
              {publicAlbums.filter(a => a.userId === viewingUser.id).map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && !selectedAlbum && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar user={profile} size="lg" />
                  <button 
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <input
                    type="file"
                    ref={avatarInputRef}
                    onChange={(e) => handleImageUpload(e, 'avatar')}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-medium">{profile.displayName}</h2>
                  <p className="text-xs text-white/50">@{profile.username}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowProfileModal(true)}
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-xs"
              >
                Edit Profile
              </button>
            </div>

            <p className="text-sm text-white/70">{profile.bio}</p>

            <div className="flex gap-4 text-xs text-white/50">
              <span><strong className="text-white">{profile.followers}</strong> followers</span>
              <span><strong className="text-white">{profile.following}</strong> following</span>
              <span><strong className="text-white">{albums.filter(a => a.isPublic).length}</strong> public albums</span>
            </div>

            <div className="pt-4 border-t border-white/5">
              <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3">Your Public Albums</h3>
              <div className="grid grid-cols-3 gap-3">
                {albums.filter(a => a.isPublic).map((album) => (
                  <AlbumCard key={album.id} album={album} isOwn={true} />
                ))}
              </div>
              {albums.filter(a => a.isPublic).length === 0 && (
                <p className="text-center text-white/30 text-sm py-8">No public albums yet</p>
              )}
            </div>
          </div>
        )}

        {/* Album Items View */}
        {selectedAlbum && (
          <div className="grid grid-cols-3 gap-3">
            {selectedAlbum.items.map((item, index) => (
              <a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group text-left"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-2 transition-transform duration-300 group-hover:scale-[1.02]">
                  <ImageBox src={item.image} color={item.imageColor} alt={item.title} />
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ boxShadow: `inset 0 0 30px ${item.imageColor}40` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                    <div className="p-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                </div>
                <h3 className="text-xs font-medium text-white/80 group-hover:text-white transition-colors line-clamp-2">
                  {item.title}
                </h3>
              </a>
            ))}
            
            {selectedAlbum.items.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                  <Plus className="w-5 h-5 text-white/30" />
                </div>
                <p className="text-white/40 text-sm mb-3">This album is empty</p>
                {selectedAlbum.userId === 1 && (
                  <button
                    onClick={() => setShowAddItemModal(true)}
                    className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    Add your first item
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/5" style={{ backgroundColor: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <button 
              onClick={() => { setActiveTab('home'); setSelectedAlbum(null); setViewingUser(null); }}
              className={`flex flex-col items-center gap-1 px-6 py-1 rounded-lg transition-colors ${activeTab === 'home' ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px]">Home</span>
            </button>
            <button 
              onClick={() => { setActiveTab('discover'); setSelectedAlbum(null); setViewingUser(null); }}
              className={`flex flex-col items-center gap-1 px-6 py-1 rounded-lg transition-colors ${activeTab === 'discover' ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
            >
              <Compass className="w-5 h-5" />
              <span className="text-[10px]">Discover</span>
            </button>
            <button 
              onClick={() => { setActiveTab('profile'); setSelectedAlbum(null); setViewingUser(null); }}
              className={`flex flex-col items-center gap-1 px-6 py-1 rounded-lg transition-colors ${activeTab === 'profile' ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px]">Profile</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Create Album Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}>
          <div className="w-full max-w-sm bg-neutral-900 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-light">Create Album</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-2 rounded-full hover:bg-white/10">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs text-white/50 mb-2">Album Name</label>
                <input
                  type="text"
                  value={newAlbum.name}
                  onChange={(e) => setNewAlbum({ ...newAlbum, name: e.target.value })}
                  placeholder="My Favorites"
                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/30 focus:outline-none transition-colors text-white placeholder-white/30 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs text-white/50 mb-2">Cover Image</label>
                <input type="file" ref={albumCoverInputRef} onChange={(e) => handleImageUpload(e, 'album')} accept="image/*" className="hidden" />
                <div className="flex gap-3 items-start">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0" style={{ backgroundColor: newAlbum.coverColor }}>
                    {newAlbum.cover ? (
                      <img src={newAlbum.cover} alt="Cover preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-white/20" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <button onClick={() => albumCoverInputRef.current?.click()} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-xs flex items-center justify-center gap-2">
                      <Upload className="w-3.5 h-3.5" />
                      Choose from Library
                    </button>
                    <p className="text-[10px] text-white/30 mt-2">Or pick a color:</p>
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {colorOptions.map(color => (
                        <button
                          key={color}
                          onClick={() => setNewAlbum({ ...newAlbum, coverColor: color, cover: null })}
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
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border transition-all ${!newAlbum.isPublic ? 'bg-white/10 border-white/30' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span className="text-xs">Private</span>
                  </button>
                  <button
                    onClick={() => setNewAlbum({ ...newAlbum, isPublic: true })}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border transition-all ${newAlbum.isPublic ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                  >
                    <Globe className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-xs">Public</span>
                  </button>
                </div>
              </div>
              
              <button onClick={handleCreateAlbum} className="w-full py-3 rounded-lg bg-white text-black font-medium hover:bg-white/90 transition-colors text-sm">
                Create Album
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}>
          <div className="w-full max-w-sm bg-neutral-900 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-light">Add Item</h2>
              <button onClick={() => setShowAddItemModal(false)} className="p-2 rounded-full hover:bg-white/10">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs text-white/50 mb-2">Title</label>
                <input
                  type="text"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="Enter title..."
                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/30 focus:outline-none transition-colors text-white placeholder-white/30 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs text-white/50 mb-2">Image</label>
                <input type="file" ref={itemImageInputRef} onChange={(e) => handleImageUpload(e, 'item')} accept="image/*" className="hidden" />
                <div className="flex gap-3 items-start">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0" style={{ backgroundColor: newItem.imageColor }}>
                    {newItem.image ? (
                      <img src={newItem.image} alt="Item preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-5 h-5 rounded-full bg-white/20" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <button onClick={() => itemImageInputRef.current?.click()} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-xs flex items-center justify-center gap-2">
                      <Upload className="w-3.5 h-3.5" />
                      Choose from Library
                    </button>
                    <p className="text-[10px] text-white/30 mt-2">Or pick a color:</p>
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {colorOptions.map(color => (
                        <button
                          key={color}
                          onClick={() => setNewItem({ ...newItem, imageColor: color, image: null })}
                          className={`w-4 h-4 rounded-full transition-all ${newItem.imageColor === color && !newItem.image ? 'ring-2 ring-white ring-offset-1 ring-offset-neutral-900' : ''}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-xs text-white/50 mb-2">Link URL</label>
                <input
                  type="text"
                  value={newItem.link}
                  onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/30 focus:outline-none transition-colors text-white placeholder-white/30 text-sm"
                />
              </div>
              
              <button onClick={handleAddItem} className="w-full py-3 rounded-lg bg-white text-black font-medium hover:bg-white/90 transition-colors text-sm">
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Create Modal */}
      {showAIModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}>
          <div className="w-full max-w-sm bg-neutral-900 rounded-2xl p-6 border border-violet-500/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                </div>
                <h2 className="text-lg font-light">AI Creator</h2>
              </div>
              <button onClick={() => { setShowAIModal(false); setAiResult(null); setAiPrompt(''); }} className="p-2 rounded-full hover:bg-white/10">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {!aiResult ? (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs text-white/50 mb-2">Describe your album</label>
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g., workout playlists, italian recipes..."
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-violet-500/50 focus:outline-none transition-colors text-white placeholder-white/30 resize-none text-sm"
                  />
                </div>
                
                <div className="flex flex-wrap gap-1.5">
                  {['gym routines', 'workout playlists', 'italian recipes'].map(suggestion => (
                    <button
                      key={suggestion}
                      onClick={() => setAiPrompt(suggestion)}
                      className="px-2.5 py-1 rounded-full text-[10px] bg-white/5 border border-white/10 hover:border-white/20 text-white/60 hover:text-white/80 transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={handleAIGenerate}
                  disabled={!aiPrompt || aiGenerating}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
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
                  <div className="grid grid-cols-2 gap-2">
                    {aiResult.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-md flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: item.imageColor }}>
                          <div className="w-3 h-3 rounded-full bg-white/20" />
                        </div>
                        <span className="text-[10px] text-white/70 line-clamp-2">{item.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button onClick={() => setAiResult(null)} className="flex-1 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm">
                    Try Again
                  </button>
                  <button onClick={handleAcceptAI} className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-medium hover:opacity-90 transition-opacity text-sm">
                    Add to Library
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}>
          <div className="w-full max-w-sm bg-neutral-900 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-light">Edit Profile</h2>
              <button onClick={() => setShowProfileModal(false)} className="p-2 rounded-full hover:bg-white/10">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs text-white/50 mb-2">Display Name</label>
                <input
                  type="text"
                  value={profile.displayName}
                  onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/30 focus:outline-none transition-colors text-white text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs text-white/50 mb-2">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/30 focus:outline-none transition-colors text-white text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-xs text-white/50 mb-2">Avatar Color</label>
                <div className="flex gap-2 flex-wrap">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      onClick={() => setProfile({ ...profile, avatarColor: color, avatar: null })}
                      className={`w-8 h-8 rounded-full transition-all ${profile.avatarColor === color && !profile.avatar ? 'ring-2 ring-white ring-offset-2 ring-offset-neutral-900' : ''}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              
              <button 
                onClick={() => setShowProfileModal(false)} 
                className="w-full py-3 rounded-lg bg-white text-black font-medium hover:bg-white/90 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}