import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './lib/AuthContext'
import Layout from './components/Layout'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import DiscoverPage from './pages/DiscoverPage'
import ProfilePage from './pages/ProfilePage'
import AlbumPage from './pages/AlbumPage'
import UserPage from './pages/UserPage'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />
  }
  
  return children
}

export default function App() {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 animate-pulse" />
          <span className="text-white/50 text-lg font-light">shelf</span>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/" replace /> : <AuthPage />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<HomePage />} />
        <Route path="discover" element={<DiscoverPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="album/:albumId" element={<AlbumPage />} />
        <Route path="user/:username" element={<UserPage />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
