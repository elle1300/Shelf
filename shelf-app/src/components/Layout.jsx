import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Home, Compass, User } from 'lucide-react'

export default function Layout() {
  const location = useLocation()
  const isAlbumPage = location.pathname.startsWith('/album/')
  const isUserPage = location.pathname.startsWith('/user/')

  return (
    <div className="min-h-screen bg-black text-white">
      <main className={`${!isAlbumPage && !isUserPage ? 'pb-20' : ''}`}>
        <Outlet />
      </main>

      {/* Bottom Navigation - hide on album/user detail pages */}
      {!isAlbumPage && !isUserPage && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/5 bg-black/95 backdrop-blur-xl">
          <div className="max-w-lg mx-auto px-4">
            <div className="flex items-center justify-around py-3">
              <NavLink 
                to="/"
                className={({ isActive }) => `flex flex-col items-center gap-1 px-6 py-1 rounded-lg transition-colors ${isActive ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
              >
                <Home className="w-5 h-5" />
                <span className="text-[10px]">Home</span>
              </NavLink>
              
              <NavLink 
                to="/discover"
                className={({ isActive }) => `flex flex-col items-center gap-1 px-6 py-1 rounded-lg transition-colors ${isActive ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
              >
                <Compass className="w-5 h-5" />
                <span className="text-[10px]">Discover</span>
              </NavLink>
              
              <NavLink 
                to="/profile"
                className={({ isActive }) => `flex flex-col items-center gap-1 px-6 py-1 rounded-lg transition-colors ${isActive ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
              >
                <User className="w-5 h-5" />
                <span className="text-[10px]">Profile</span>
              </NavLink>
            </div>
          </div>
        </nav>
      )}
    </div>
  )
}
