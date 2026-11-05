import React from 'react';
import Link from 'next/link';
import { Aperture, ArrowLeft, Search, Home, Compass, HelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-16">
      <div className="max-w-xl w-full text-center space-y-8">
        {/* Kinetic Aperture Shutter Graphic */}
        <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
          {/* Subtle Ambient Glow */}
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />

          {/* Concentric Calibration Rings */}
          <div className="absolute inset-0 rounded-full border border-primary/20 animate-spin [animation-duration:18s]" />
          <div className="absolute inset-2 rounded-full border border-dashed border-white/10" />

          {/* Aperture Shutter SVG Mark */}
          <div className="relative w-16 h-16 rounded-2xl bg-surface-container-low border border-white/10 flex items-center justify-center text-primary shadow-2xl">
            <svg
              className="w-10 h-10"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="24"
                cy="24"
                r="21"
                stroke="#ffcd8b"
                strokeWidth="1.5"
                strokeOpacity="0.4"
                strokeDasharray="2 3"
              />
              <path
                d="M24 8 C30 16, 32 20, 40 24"
                stroke="#ffcd8b"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M40 24 C32 30, 28 32, 24 40"
                stroke="#ffcd8b"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M24 40 C18 32, 16 28, 8 24"
                stroke="#ffcd8b"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M8 24 C16 18, 20 16, 24 8"
                stroke="#ffcd8b"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="24" cy="24" r="5" fill="#ffcd8b" />
            </svg>
          </div>
        </div>

        {/* Headline & Narrative */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container border border-white/10 text-outline font-mono text-[11px] uppercase tracking-wider">
            <span>Error 404 • Missing Track</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-on-surface">
            Scene Missing from Reel
          </h1>

          <p className="font-sans text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
            The studio space, stage specification, or permalink you are scouting cannot be located on the Aperture network. It may have been archived or relocated.
          </p>
        </div>

        {/* Primary Call-to-Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-display text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/10 active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Return to Marketplace</span>
          </Link>

          <Link
            href="/studios"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-surface-container hover:bg-surface-container-high border border-white/10 text-on-surface font-display text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-primary" />
            <span>Explore Active Stages</span>
          </Link>
        </div>

        {/* Quick Navigation Directory */}
        <div className="pt-6 border-t border-white/5">
          <div className="text-[11px] font-mono text-outline uppercase tracking-wider mb-3">
            Quick Discovery Shortcuts:
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-sans text-on-surface-variant">
            <Link href="/studios?category=Film+Soundstage" className="hover:text-primary transition-colors">
              Film Soundstages
            </Link>
            <span className="text-outline/30">•</span>
            <Link href="/studios?category=Photo+Studio" className="hover:text-primary transition-colors">
              Daylight Photo Lofts
            </Link>
            <span className="text-outline/30">•</span>
            <Link href="/how-it-works" className="hover:text-primary transition-colors">
              How Booking Works
            </Link>
            <span className="text-outline/30">•</span>
            <Link href="/about-us" className="hover:text-primary transition-colors">
              About Aperture
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
