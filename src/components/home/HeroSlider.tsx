'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, ArrowRight, Star, MapPin } from 'lucide-react';

interface ShowcaseItem {
  id: string;
  category: string;
  title: string;
  location: string;
  pricePerHour: number;
  rating: number;
  reviewsCount: number;
  image: string;
  tag: string;
}

const showcaseStudios: ShowcaseItem[] = [
  {
    id: 'studio_01',
    category: 'Film Soundstage',
    title: 'Sonder Stage A: 40ft Pre-Lit White Cyclorama',
    location: 'Brooklyn Navy Yard, NY',
    pricePerHour: 145,
    rating: 4.95,
    reviewsCount: 38,
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
    tag: 'Pre-Hung Arri SkyPanels',
  },
  {
    id: 'studio_02',
    category: 'Photo Studio',
    title: 'Apex Natural Daylight Loft & Still Studio',
    location: 'SoHo Cast Iron District, NY',
    pricePerHour: 95,
    rating: 4.91,
    reviewsCount: 44,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    tag: '14ft Northern Skylights',
  },
  {
    id: 'studio_03',
    category: 'Recording & Podcast Suite',
    title: 'Echo Chamber: Dolby Atmos 7.1.4 Mixing Suite',
    location: 'Arts District, Los Angeles, CA',
    pricePerHour: 110,
    rating: 4.98,
    reviewsCount: 29,
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
    tag: 'Genelec SAM & Neumann Mics',
  },
];

export function HeroSlider() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const activeItem = showcaseStudios[activeTab];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (selectedCity && selectedCity !== 'all') params.set('city', selectedCity);
    router.push(`/studios?${params.toString()}`);
  };

  const quickCategories = [
    { label: 'Photo Cyc Stages', query: 'Photo Studio' },
    { label: 'Film Soundstages', query: 'Film Soundstage' },
    { label: 'Dolby Audio Suites', query: 'Recording & Podcast Suite' },
    { label: 'Dance & Movement', query: 'Dance & Rehearsal Hall' },
  ];

  return (
    <section className="relative w-full border-b border-white/[0.06] bg-surface overflow-hidden">
      {/* Subtle Warm Background Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-primary/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-14 pb-18 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Search & Categories */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-on-surface leading-[1.1]">
                High-Caliber Creative Spaces for <span className="text-primary">Visionary Productions</span>
              </h1>
              <p className="font-sans text-base text-on-surface-variant max-w-xl leading-relaxed">
                Reserve vetted soundstages, natural daylight cycloramas, analog mixing suites, and rehearsal halls directly from verified creators.
              </p>
            </div>

            {/* Integrated Minimalist Search Bar */}
            <form
              onSubmit={handleSearch}
              className="p-2 rounded-2xl bg-surface-container-low border border-white/10 shadow-2xl shadow-black/40 max-w-xl"
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                
                {/* Search Term Input */}
                <div className="sm:col-span-6 px-3 py-2 flex items-center gap-2.5">
                  <Search className="w-4 h-4 text-outline flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by cyc, cinema, acoustics..."
                    className="w-full bg-transparent text-xs text-on-surface placeholder:text-outline focus:outline-none font-sans"
                  />
                </div>

                {/* City Location Select */}
                <div className="sm:col-span-3 border-t sm:border-t-0 sm:border-l border-white/10 px-3 py-2">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-transparent text-xs text-on-surface-variant focus:outline-none cursor-pointer font-sans"
                  >
                    <option value="" className="bg-surface-container text-on-surface">All Cities</option>
                    <option value="New York" className="bg-surface-container text-on-surface">New York, NY</option>
                    <option value="Los Angeles" className="bg-surface-container text-on-surface">Los Angeles, CA</option>
                    <option value="Chicago" className="bg-surface-container text-on-surface">Chicago, IL</option>
                    <option value="Austin" className="bg-surface-container text-on-surface">Austin, TX</option>
                    <option value="San Francisco" className="bg-surface-container text-on-surface">San Francisco, CA</option>
                    <option value="Seattle" className="bg-surface-container text-on-surface">Seattle, WA</option>
                  </select>
                </div>

                {/* Find Button */}
                <div className="sm:col-span-3">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </form>

            {/* Quick Category Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-mono text-outline uppercase tracking-wider mr-1">
                Quick Filters:
              </span>
              {quickCategories.map((c) => (
                <Link
                  key={c.label}
                  href={`/studios?category=${encodeURIComponent(c.query)}`}
                  className="px-3 py-1 rounded-lg bg-surface-container border border-white/5 text-[11px] text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all font-sans"
                >
                  {c.label}
                </Link>
              ))}
            </div>

          </div>

          {/* Right Column: Interactive Rotating Showcase Card */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            
            {/* Tab Selectors (01 / 02 / 03) */}
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-mono uppercase tracking-widest text-outline">
                Curated Showcase ({activeTab + 1}/3)
              </span>
              <div className="flex items-center gap-1.5">
                {showcaseStudios.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(idx)}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all ${
                      activeTab === idx
                        ? 'bg-primary text-on-primary font-bold shadow-sm'
                        : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-white/5'
                    }`}
                  >
                    0{idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Showcase Card Frame */}
            <div className="group relative rounded-2xl overflow-hidden bg-surface-container-low border border-white/10 shadow-2xl transition-all">
              
              {/* Image Preview Container */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-container-highest">
                <img
                  src={activeItem.image}
                  alt={activeItem.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Gradient Shadow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-90" />

                {/* Top Category Pill */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-surface/80 backdrop-blur-md border border-white/10 text-[11px] font-mono text-primary font-medium">
                    {activeItem.category}
                  </span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-3 left-4 right-4">
                  <div className="flex items-center gap-1.5 text-xs text-primary mb-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-bold">{activeItem.rating.toFixed(2)}</span>
                    <span className="text-on-surface-variant">({activeItem.reviewsCount} reviews)</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-on-surface line-clamp-1 leading-snug">
                    {activeItem.title}
                  </h3>
                </div>
              </div>

              {/* Bottom Card Footer Strip */}
              <div className="p-4 px-5 flex items-center justify-between border-t border-white/5 bg-surface-container-low">
                <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                  <MapPin className="w-3.5 h-3.5 text-outline" />
                  <span>{activeItem.location}</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-display font-bold text-base text-primary">${activeItem.pricePerHour}</span>
                    <span className="text-[11px] text-outline font-mono"> / hr</span>
                  </div>

                  <Link
                    href={`/studios`}
                    className="p-2 rounded-xl bg-surface-container-high border border-white/10 text-on-surface hover:text-primary hover:border-primary/40 transition-all"
                    title="View Studio Details"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
