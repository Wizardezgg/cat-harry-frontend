'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
  Sun,
  Moon,
  PlusCircle,
  FolderKanban,
  CalendarCheck,
  Heart,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';

export function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Signed out securely');
      setDropdownOpen(false);
      router.push('/');
    } catch {
      toast.error('Failed to sign out');
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Explore Studios', href: '/studios' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'About Us', href: '/about-us' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-white/[0.06]">
      <div className="h-20 w-full px-6 lg:px-12 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-surface-container-high border border-white/10 flex items-center justify-center text-primary group-hover:border-primary/40 group-hover:scale-105 transition-all">
              {/* Option 04: Continuous Kinetic Vortex */}
              <svg className="w-5 h-5 text-primary" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
                <path d="M24 4 C32 14 36 24 24 24 C14 24 14 32 24 44" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path d="M44 24 C34 32 24 36 24 24 C24 14 32 14 4 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.75" />
                <circle cx="24" cy="24" r="5.5" fill="currentColor" />
                <circle cx="24" cy="24" r="2" fill="#121318" />
              </svg>
            </div>
            <span className="font-display font-medium text-xl tracking-tight text-on-surface group-hover:text-primary transition-colors">
              Aperture
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-sans text-sm px-3.5 py-1.5 rounded-lg transition-all ${
                    active
                      ? 'bg-surface-container-high text-primary font-medium border border-white/5 shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/40'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button (Challenge 3) */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="p-2 rounded-lg border border-white/10 bg-surface-container-low text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all focus:outline-none"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-primary" />
            ) : (
              <Moon className="w-4 h-4 text-on-surface" />
            )}
          </button>

          {/* Wishlist Link */}
          <Link
            href="/wishlist"
            className="p-2 rounded-lg border border-white/10 bg-surface-container-low text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all relative"
            title="Saved Wishlist Studios"
          >
            <Heart className="w-4 h-4" />
          </Link>

          {/* User Profile or Guest Controls */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-3 rounded-full border border-white/10 bg-surface-container-low hover:bg-surface-container hover:border-white/20 transition-all focus:outline-none"
              >
                <div className="hidden md:flex flex-col text-right">
                  <span className="font-sans text-xs font-medium text-on-surface leading-tight">
                    {user.name}
                  </span>
                  <span className="font-display text-[10px] text-primary/90 uppercase tracking-widest leading-none mt-0.5">
                    Creator
                  </span>
                </div>
                {user.photoUrl && !user.photoUrl.includes('photo-1534528741775') ? (
                  <img
                    src={user.photoUrl}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-primary/40"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs font-mono ring-1 ring-primary/40">
                    {(user.name || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-on-surface-variant mr-1" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-surface-container-high border border-white/10 shadow-2xl py-2 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2.5 border-b border-white/5">
                    <p className="text-xs font-semibold text-on-surface truncate">{user.name}</p>
                    <p className="text-[11px] text-on-surface-variant truncate">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/add-studio"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-on-surface hover:text-primary hover:bg-surface-container transition-colors"
                    >
                      <PlusCircle className="w-4 h-4 text-primary" />
                      <span>Add New Studio</span>
                    </Link>
                    <Link
                      href="/my-listings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-on-surface hover:text-primary hover:bg-surface-container transition-colors"
                    >
                      <FolderKanban className="w-4 h-4 text-primary" />
                      <span>My Studio Listings</span>
                    </Link>
                    <Link
                      href="/my-bookings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-on-surface hover:text-primary hover:bg-surface-container transition-colors"
                    >
                      <CalendarCheck className="w-4 h-4 text-primary" />
                      <span>My Bookings</span>
                    </Link>
                  </div>

                  <div className="border-t border-white/5 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="font-sans text-xs font-medium px-3.5 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/40 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="font-sans text-xs font-medium px-3.5 py-1.5 rounded-lg border border-primary/40 bg-primary/10 text-primary hover:bg-primary hover:text-on-primary transition-all"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg border border-white/10 bg-surface-container-low text-on-surface-variant hover:text-on-surface"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-white/10 bg-surface-container-high/95 backdrop-blur-xl px-6 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? 'bg-surface-container text-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {link.name}
            </Link>
          ))}
          {!user && (
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 text-sm text-on-surface-variant hover:text-on-surface font-medium"
              >
                Log In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 text-sm bg-primary text-on-primary rounded-lg font-medium"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
