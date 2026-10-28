import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, PlusCircle, LayoutDashboard, LogOut, Menu, X, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';
import { getInitials } from '../../utils/formatters';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-[#FFFFF0]/90 backdrop-blur-md border-b border-[#87A96B]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-[#2D5016] flex items-center justify-center text-[#FFFFF0] shadow-md group-hover:scale-105 transition-transform duration-200">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#2D5016]">
                WanderWise
              </span>
              <span className="ml-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-[#D4A017] text-white">
                AI
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-3">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/')
                  ? 'text-[#2D5016] bg-[#87A96B]/15'
                  : 'text-gray-700 hover:text-[#2D5016] hover:bg-[#87A96B]/10'
              }`}
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
                    isActive('/dashboard')
                      ? 'text-[#2D5016] bg-[#87A96B]/15'
                      : 'text-gray-700 hover:text-[#2D5016] hover:bg-[#87A96B]/10'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/trips/new"
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
                    isActive('/trips/new')
                      ? 'text-[#2D5016] bg-[#87A96B]/15'
                      : 'text-gray-700 hover:text-[#2D5016] hover:bg-[#87A96B]/10'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  Plan New Trip
                </Link>
              </>
            ) : null}
          </div>

          {/* Desktop Right Side / Profile */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-3 p-1.5 pl-3 rounded-full border border-[#87A96B]/30 hover:bg-white transition-all cursor-pointer shadow-2xs"
                >
                  <span className="text-sm font-semibold text-[#1A1A2E] max-w-[120px] truncate">
                    {user.display_name}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#2D5016] text-[#FFFFF0] flex items-center justify-center text-xs font-bold ring-2 ring-[#87A96B]/30">
                    {getInitials(user.display_name)}
                  </div>
                </button>

                {/* Dropdown menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-xs text-gray-500 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-[#1A1A2E] truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#E8F0E4]/60 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#2D5016]" />
                      My Trips
                    </Link>
                    <Link
                      to="/trips/new"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#E8F0E4]/60 transition-colors"
                    >
                      <PlusCircle className="w-4 h-4 text-[#2D5016]" />
                      Plan A Trip
                    </Link>
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-[#E8735A] hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-700 hover:text-[#2D5016] hover:bg-[#87A96B]/10 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#87A96B]/20 bg-[#FFFFF0] px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-semibold text-gray-700 hover:bg-[#87A96B]/15"
          >
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-semibold text-gray-700 hover:bg-[#87A96B]/15"
              >
                Dashboard
              </Link>
              <Link
                to="/trips/new"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-semibold text-gray-700 hover:bg-[#87A96B]/15"
              >
                Plan New Trip
              </Link>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="w-9 h-9 rounded-full bg-[#2D5016] text-white flex items-center justify-center font-bold text-xs">
                    {user?.display_name ? getInitials(user.display_name) : 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1A1A2E]">{user?.display_name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full mt-2 text-left px-3 py-2 text-sm font-semibold text-[#E8735A] rounded-xl hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full">
                  Get Started Free
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
