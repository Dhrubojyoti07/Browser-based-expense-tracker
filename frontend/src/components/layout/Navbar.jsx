import { Wallet, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * Fixed top navigation bar.
 */
export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 shadow-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Wallet className="h-6 w-6 text-indigo-400" />
          <span className="text-lg font-semibold text-white">ExpenseTracker</span>
        </div>

        {/* User info & logout */}
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-gray-300 sm:block">
            {user?.name || user?.email}
          </span>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
