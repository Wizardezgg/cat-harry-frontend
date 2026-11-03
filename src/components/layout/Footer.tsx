'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Send, Instagram, Youtube, Linkedin, Mail } from 'lucide-react';
import { toast } from 'sonner';

export function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    toast.success('Thank you for subscribing to StudioSpace creative dispatch!');
    setEmail('');
  };

  return (
    <footer className="w-full bg-surface-container-lowest border-t border-white/5 text-outline pt-16 pb-10 transition-colors">
      <div className="w-full px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-14">
          
          {/* Brand & Mission Statement */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-surface-container-high border border-white/10 flex items-center justify-center text-primary group-hover:border-primary/40 transition-colors">
                {/* Studio Aperture Shutter Icon */}
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 3.07c2.9.36 5.27 2.37 6.13 5.09L14.4 7.6l-1.4-2.53zM7.06 6.32l4.8 2.77-3.9 3.9-3.4-3.4c.66-1.34 1.54-2.48 2.5-3.27zm-3.04 7.15l3.9-1.05 1.74 4.79-4.32-.97c-.83-.8-1.32-1.77-1.32-2.77zm11.23 6.46l-4.8-2.77 3.9-3.9 3.4 3.4c-.66 1.34-1.54 2.48-2.5 3.27zm3.04-7.15l-3.9 1.05-1.74-4.79 4.32.97c.83.8 1.32 1.77 1.32 2.77z"/>
                </svg>
              </div>
              <span className="font-display font-medium text-lg tracking-tight text-on-surface group-hover:text-primary transition-colors">
                Studio<span className="text-primary">Space</span>
              </span>
            </Link>
            
            <p className="text-sm text-on-surface-variant max-w-md leading-relaxed">
              Curated peer-to-peer workspace platform for filmmakers, photographers, audio engineers, and visual artists. Transparent hourly rates, verified power grids, and instant reservation escrow.
            </p>
            
            {/* Social Links featuring the new X logo */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="StudioSpace on X"
                className="w-8 h-8 rounded-lg border border-white/10 bg-surface-container-low text-on-surface-variant hover:text-primary hover:border-primary/40 flex items-center justify-center transition-all"
              >
                {/* Official new X logo (replaces Twitter bird) */}
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="StudioSpace on Instagram"
                className="w-8 h-8 rounded-lg border border-white/10 bg-surface-container-low text-on-surface-variant hover:text-primary hover:border-primary/40 flex items-center justify-center transition-all"
              >
                <Instagram className="w-3.5 h-3.5" aria-hidden="true" />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="StudioSpace on YouTube"
                className="w-8 h-8 rounded-lg border border-white/10 bg-surface-container-low text-on-surface-variant hover:text-primary hover:border-primary/40 flex items-center justify-center transition-all"
              >
                <Youtube className="w-3.5 h-3.5" aria-hidden="true" />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="StudioSpace on LinkedIn"
                className="w-8 h-8 rounded-lg border border-white/10 bg-surface-container-low text-on-surface-variant hover:text-primary hover:border-primary/40 flex items-center justify-center transition-all"
              >
                <Linkedin className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Quick Platform Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-display uppercase tracking-widest text-on-surface font-semibold">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-on-surface-variant">
              <li>
                <Link href="/studios" className="hover:text-primary transition-colors">
                  Explore Workspaces
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-primary transition-colors">
                  How Booking Works
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="hover:text-primary transition-colors">
                  About Collective
                </Link>
              </li>
              <li>
                <Link href="/add-studio" className="hover:text-primary transition-colors">
                  List Your Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio Categories */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-display uppercase tracking-widest text-on-surface font-semibold">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-on-surface-variant">
              <li>
                <Link href="/studios?category=Photo%20Studio" className="hover:text-primary transition-colors">
                  Photo Cyc Stages
                </Link>
              </li>
              <li>
                <Link href="/studios?category=Film%20Soundstage" className="hover:text-primary transition-colors">
                  Film Soundstages
                </Link>
              </li>
              <li>
                <Link href="/studios?category=Recording%20%26%20Podcast%20Suite" className="hover:text-primary transition-colors">
                  Dolby Audio Suites
                </Link>
              </li>
              <li>
                <Link href="/studios?category=Dance%20%26%20Rehearsal%20Hall" className="hover:text-primary transition-colors">
                  Dance & Movement
                </Link>
              </li>
              <li>
                <Link href="/studios?category=Art%20%26%20Ceramic%20Atelier" className="hover:text-primary transition-colors">
                  Ceramic Ateliers
                </Link>
              </li>
            </ul>
          </div>

          {/* Creator Newsletter Input */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-display uppercase tracking-widest text-on-surface font-semibold">
              Creator Dispatch
            </h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Curated studio drops, technical lighting setups, and member production perks.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-outline absolute left-3 top-3" aria-hidden="true" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="creator@production.com"
                  spellCheck={false}
                  required
                  className="w-full pl-9 pr-3 py-2 bg-surface-container-low border border-white/10 rounded-lg text-xs text-on-surface placeholder:text-outline/60 focus:outline-none focus:border-primary/60 font-sans transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-3 bg-primary hover:bg-primary-container text-on-primary font-medium rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <Send className="w-3 h-3" aria-hidden="true" />
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Platform Legal */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-outline gap-4">
          <p>© {new Date().getFullYear()} StudioSpace Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/about-us" className="hover:text-primary transition-colors">
              Terms & Legal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
