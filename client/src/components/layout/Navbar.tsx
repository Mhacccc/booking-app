import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const { user, isLoading, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-gray-200 shadow-sm h-16">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-full flex items-center justify-between">
        {/* Left Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary select-none">
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="tracking-tight font-extrabold text-2xl">StayScape</span>
        </Link>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/hotels" className="text-gray-700 hover:text-primary font-medium text-sm transition-colors">
            Explore Stays
          </Link>
          {user && (
            <Link to="/bookings" className="text-gray-700 hover:text-primary font-medium text-sm transition-colors">
              My Bookings
            </Link>
          )}
        </nav>

        {/* Right Auth / Profile */}
        <div className="flex items-center gap-4">
          {isLoading ? (
            <span className="text-xs text-gray-500">Syncing session...</span>
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col text-right hidden sm:flex">
                <span className="text-sm font-semibold text-gray-900 leading-tight">
                  {user.username}
                </span>
                {user.isAdmin && (
                  <span className="text-[10px] uppercase font-bold text-superhost tracking-wider">
                    Administrator
                  </span>
                )}
              </div>
              <Avatar username={user.username} size="sm" />
              <Button variant="ghost" className="h-[36px] px-3 text-xs" onClick={handleLogout}>
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" className="h-[38px] px-4 text-sm font-semibold">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" className="h-[38px] px-4 text-sm font-semibold">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
