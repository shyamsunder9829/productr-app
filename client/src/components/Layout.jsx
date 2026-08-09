import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Package, Search, ChevronDown, LogOut, User, Menu, X, House } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="flex h-screen min-w-0 bg-white overflow-hidden">
      {/* Sidebar */}
      {sidebarOpen && (
        <button
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}
      <aside className={`fixed inset-y-0 left-0 z-40 w-[215px] bg-[#1a2234] flex flex-col flex-shrink-0 transform transition-transform duration-200 md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <span className="text-white text-lg font-bold">Productr</span>
            <div className="flex relative">
              <div className="w-4 h-4 rounded-full bg-orange-400"></div>
              <div className="w-4 h-4 rounded-full bg-orange-300 -ml-2 mt-1 opacity-80"></div>
            </div>
          </div>
          <button aria-label="Close navigation" onClick={() => setSidebarOpen(false)} className="text-white/70 md:hidden">
            <X size={20} />
          </button>
        </div>

        <div className="px-4 py-3">
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 text-white/50">
            <Search size={14} />
            <span className="text-xs">Search</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1">
          <NavLink
            to="/"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive ? 'bg-white/15 text-white font-medium' : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <House size={16} />
            <span>Home</span>
          </NavLink>
          <NavLink
            to="/products"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive ? 'bg-white/15 text-white font-medium' : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Package size={16} />
            <span>Products</span>
          </NavLink>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 border-b border-gray-200 bg-white flex-shrink-0">
          <div className="flex min-w-0 items-center gap-2 text-gray-900 text-sm">
            <button aria-label="Open navigation" onClick={() => setSidebarOpen(true)} className="text-gray-600 md:hidden">
              <Menu size={20} />
            </button>
            <Package size={16} />
            <span className="text-xl font-bold">Products</span>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <div className="hidden items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 text-gray-400 w-52 lg:flex">
              <Search size={14} />
              <span className="text-sm">Search Services, Products</span>
            </div>
            <div className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-1.5">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <User size={16} className="text-gray-600" />
                </div>
                <ChevronDown size={14} className="text-gray-600" />
              </button>
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)}></div>
                  <div className="absolute right-0 top-10 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-xs text-gray-500 truncate">{user?.email || user?.phone}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto" style={{
          background: 'linear-gradient(135deg, #fff9f9 0%, #fff 40%, #fffff0 100%)'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}