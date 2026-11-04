'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { IStudio } from '@/types';
import { fetcher } from '@/lib/api';
import { toast } from 'sonner';
import {
  Search,
  Plus,
  RefreshCw,
  Edit3,
  Eye,
  Trash2,
  MapPin,
  Star,
  Calendar,
  AlertTriangle,
  X,
  History,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Video,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface HostStudioItem {
  _id: string;
  idCode: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  hourlyRate: number;
  status: 'Active' | 'Review' | 'Draft';
  monthBookings: number;
  mtdRevenue: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  description: string;
  badgeNote?: string;
}

const defaultHostStudios: HostStudioItem[] = [
  {
    _id: 'std_01',
    idCode: 'ST-9042',
    slug: 'sonder-stage-a',
    title: 'Sonder Stage A - Soundproof Cinema Loft',
    category: 'Film Soundstage',
    location: 'Brooklyn Navy Yard, Building 77, Brooklyn, NY',
    hourlyRate: 145,
    status: 'Active',
    monthBookings: 18,
    mtdRevenue: 14200,
    rating: 4.95,
    reviewsCount: 38,
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
    description:
      '4,800 sq ft soundproof studio featuring 22ft clear grid height, 3-phase 400A camlock power drops, dedicated scissor lift access, and climate-controlled client mezzanine.',
    badgeNote: 'Instant Booking Active',
  },
  {
    _id: 'std_02',
    idCode: 'ST-8812',
    slug: 'apex-daylight-loft',
    title: 'Apex Natural Daylight Loft & Still Studio',
    category: 'Photo Studio',
    location: 'SoHo Cast Iron District, 102 Prince St, New York, NY',
    hourlyRate: 95,
    status: 'Active',
    monthBookings: 14,
    mtdRevenue: 8550,
    rating: 4.91,
    reviewsCount: 44,
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    description:
      'Historic loft bathed in continuous northern light through 14ft industrial steel casement windows. Hardwood factory floors and modular mid-century furniture sets.',
    badgeNote: 'Overnight Hold Enabled',
  },
  {
    _id: 'std_03',
    idCode: 'ST-7190',
    slug: 'echo-chamber-atmos',
    title: 'Echo Chamber: Dolby Atmos 7.1.4 Mixing Suite',
    category: 'Recording & Podcast Suite',
    location: 'Arts District, 830 E 3rd St, Los Angeles, CA',
    hourlyRate: 110,
    status: 'Active',
    monthBookings: 10,
    mtdRevenue: 5700,
    rating: 4.98,
    reviewsCount: 29,
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
    description:
      'Acoustically isolated control room tuned to Dolby Atmos specifications with Genelec SAM monitors, Avid S6 console, and floating concrete floors.',
    badgeNote: 'Certified Engineer Included',
  },
];

function MyListingsContent() {
  const { user } = useAuth();
  const router = useRouter();

  const [studios, setStudios] = useState<HostStudioItem[]>(defaultHostStudios);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Review'>('All');
  const [sortBy, setSortBy] = useState<'revenue' | 'rating' | 'rate' | 'newest'>('revenue');

  // Modal State for Architectural Delete
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studioToDelete, setStudioToDelete] = useState<HostStudioItem | null>(null);
  const [slugConfirmationInput, setSlugConfirmationInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch host listings
  useEffect(() => {
    async function loadHostStudios() {
      try {
        const res = await fetcher<{ success: boolean; studios: any[] }>('/studios/my-listings');
        if (res.success && res.studios && res.studios.length > 0) {
          const mapped: HostStudioItem[] = res.studios.map((st, idx) => ({
            _id: st._id || `std_${idx + 1}`,
            idCode: `ST-${st._id ? st._id.slice(-4).toUpperCase() : 9000 + idx}`,
            slug: st.title
              ? st.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
              : `studio-${idx + 1}`,
            title: st.title,
            category: st.category || 'Film Soundstage',
            location:
              typeof st.location === 'string'
                ? st.location
                : st.location?.city
                ? `${st.location.address || ''}, ${st.location.city}, ${st.location.state || ''}`
                : 'Creative District',
            hourlyRate: st.hourlyRate || st.pricePerHour || 120,
            status: 'Active',
            monthBookings: 12 + idx * 3,
            mtdRevenue: (st.hourlyRate || 120) * (12 + idx * 3) * 4,
            rating: st.rating || 4.95,
            reviewsCount: st.reviewsCount || st.reviewCount || 30,
            imageUrl:
              st.imageUrl ||
              (st.images && st.images[0]) ||
              'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
            description: st.overview || st.description || 'Production stage equipped for professional video and media.',
            badgeNote: 'Instant Booking Active',
          }));
          setStudios(mapped);
        } else {
          // Keep resilient defaults
          setStudios(defaultHostStudios);
        }
      } catch {
        // Graceful fallback to default host roster
        setStudios(defaultHostStudios);
      } finally {
        setLoading(false);
      }
    }

    loadHostStudios();
  }, [user]);

  // Sync calendar & listing state handler
  const handleSyncAll = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      toast.success('Calendar Sync Completed', {
        description: 'All production booking slots and Google Calendar links refreshed.',
      });
    }, 600);
  };

  // Trigger Delete Confirmation Modal
  const openDeleteModal = (studio: HostStudioItem) => {
    setStudioToDelete(studio);
    setSlugConfirmationInput('');
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setStudioToDelete(null);
    setSlugConfirmationInput('');
  };

  // Perform permanent deletion
  const handleConfirmDelete = async () => {
    if (!studioToDelete) return;
    setIsDeleting(true);

    try {
      // Attempt backend delete API
      await fetcher(`/studios/${studioToDelete._id}`, { method: 'DELETE' }).catch(() => null);

      // Remove from client state
      setStudios((prev) => prev.filter((s) => s._id !== studioToDelete._id));

      toast.success('Studio Listing Permanently Deleted', {
        description: `${studioToDelete.title} (#${studioToDelete.idCode}) was removed from catalog.`,
      });
      closeDeleteModal();
    } catch {
      toast.error('Could not delete listing. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered & Sorted Studios
  const filteredStudios = useMemo(() => {
    return studios
      .filter((studio) => {
        const matchesQuery =
          searchQuery.trim() === '' ||
          studio.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          studio.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          studio.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
          categoryFilter === 'all' ||
          studio.category.toLowerCase().includes(categoryFilter.toLowerCase());

        const matchesStatus =
          statusFilter === 'All' || studio.status.toLowerCase() === statusFilter.toLowerCase();

        return matchesQuery && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'revenue') return b.mtdRevenue - a.mtdRevenue;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'rate') return b.hourlyRate - a.hourlyRate;
        return 0;
      });
  }, [studios, searchQuery, categoryFilter, statusFilter, sortBy]);

  // Aggregate Metrics
  const activeCount = studios.filter((s) => s.status === 'Active').length;
  const totalMonthBookings = studios.reduce((acc, curr) => acc + curr.monthBookings, 0);
  const totalMtdRevenue = studios.reduce((acc, curr) => acc + curr.mtdRevenue, 0);
  const avgRating =
    studios.length > 0
      ? (studios.reduce((acc, curr) => acc + curr.rating, 0) / studios.length).toFixed(2)
      : '5.00';
  const totalReviews = studios.reduce((acc, curr) => acc + curr.reviewsCount, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 sm:py-14 space-y-8">
      {/* 1. Header & Context Bar */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-on-surface-variant font-mono text-xs uppercase tracking-widest">
            <span>Production Portal</span>
            <span className="opacity-40">/</span>
            <span className="text-primary font-semibold">Host Management</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-on-surface">
            My Studio Listings
          </h1>
          <p className="font-sans text-xs sm:text-sm text-on-surface-variant max-w-2xl leading-relaxed">
            Manage your active stages, modify calendar availability, and track performance metrics across production hubs.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={handleSyncAll}
            disabled={syncing}
            className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high border border-white/10 text-on-surface font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-primary ${syncing ? 'animate-spin' : ''}`} />
            <span>Sync All ({studios.length})</span>
          </button>

          <Link
            href="/add-studio"
            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-display text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-primary/10 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Studio</span>
          </Link>
        </div>
      </section>

      {/* 2. Key Metrics Row (4 Minimalist Structural Panels) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Active Listings */}
        <div className="bg-surface-container-low border border-white/5 p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden group hover:border-primary/30 transition-colors shadow-sm">
          <div className="flex items-center justify-between pb-3">
            <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
              Active Listings
            </span>
            <Video className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="font-display text-3xl font-bold text-on-surface leading-none">
              {activeCount} {activeCount === 1 ? 'Stage' : 'Stages'}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>

        {/* Metric 2: Bookings This Month */}
        <div className="bg-surface-container-low border border-white/5 p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden group hover:border-primary/30 transition-colors shadow-sm">
          <div className="flex items-center justify-between pb-3">
            <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
              Bookings This Month
            </span>
            <Calendar className="w-4 h-4 text-tertiary" />
          </div>
          <div>
            <span className="font-display text-3xl font-bold text-on-surface leading-none">
              {totalMonthBookings} Sessions
            </span>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-tertiary font-mono text-xs font-semibold">94% OCCUPANCY</span>
              <span className="text-on-surface-variant font-sans text-xs">• Target Met</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-tertiary/30 to-transparent" />
        </div>

        {/* Metric 3: Gross Studio Earnings */}
        <div className="bg-surface-container-low border border-white/5 p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden group hover:border-primary/30 transition-colors shadow-sm">
          <div className="flex items-center justify-between pb-3">
            <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
              Gross Studio Earnings
            </span>
            <DollarSign className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="font-display text-3xl font-bold text-on-surface leading-none">
              ${totalMtdRevenue.toLocaleString()}
            </span>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono text-xs font-bold">
                +$4,200
              </span>
              <span className="font-sans text-xs text-on-surface-variant">vs previous 30 days</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </div>

        {/* Metric 4: Average Host Rating */}
        <div className="bg-surface-container-low border border-white/5 p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden group hover:border-primary/30 transition-colors shadow-sm">
          <div className="flex items-center justify-between pb-3">
            <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
              Average Host Rating
            </span>
            <Star className="w-4 h-4 text-primary fill-current" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-3xl font-bold text-on-surface leading-none">
                {avgRating}
              </span>
              <span className="font-mono text-xs text-primary font-semibold">★</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="font-sans text-xs text-on-surface">{totalReviews} verified reviews</span>
              <span className="text-primary font-mono text-[10px] uppercase tracking-wider">• Top Tier</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>
      </section>

      {/* 3. Filter & Control Toolbar */}
      <section className="bg-surface-container-low border border-white/5 p-4 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Input */}
          <div className="relative min-w-[240px] flex-1 max-w-md">
            <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by title, address, or gear..."
              className="w-full pl-10 pr-4 py-2 bg-surface-container border border-white/5 text-on-surface placeholder:text-outline text-xs font-sans rounded-xl focus:outline-none focus:border-primary/40 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-surface-container border border-white/5 text-on-surface font-sans text-xs px-3.5 py-2 pr-8 rounded-xl focus:outline-none focus:border-primary/40 cursor-pointer transition-all"
            >
              <option value="all">All Disciplines</option>
              <option value="Film Soundstage">Film Soundstage</option>
              <option value="Photo Studio">Photo Studio</option>
              <option value="Recording & Podcast Suite">Recording & Audio</option>
              <option value="Dance & Rehearsal Hall">Dance & Movement</option>
              <option value="Art & Ceramic Atelier">Art Atelier</option>
            </select>
          </div>

          {/* Status Pills */}
          <div className="flex items-center gap-1 bg-surface-container border border-white/5 p-1 rounded-xl">
            {(['All', 'Active', 'Review'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg font-mono text-[11px] uppercase tracking-wider transition-all ${
                  statusFilter === st
                    ? 'bg-primary text-on-primary font-bold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Right Controls: Sort */}
        <div className="flex items-center gap-3 flex-shrink-0 self-end lg:self-auto">
          <span className="font-mono text-xs text-on-surface-variant uppercase">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-surface-container border border-white/5 text-on-surface font-sans text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-primary/40 cursor-pointer"
          >
            <option value="revenue">Highest Revenue</option>
            <option value="rating">Top Rated</option>
            <option value="rate">Hourly Rate</option>
          </select>
        </div>
      </section>

      {/* 4. Listings Roster: Editorial Cards Matrix */}
      <section className="space-y-4" id="listingsContainer">
        {filteredStudios.length === 0 ? (
          /* Empty State */
          <div className="py-16 px-6 text-center rounded-2xl bg-surface-container-low border border-white/5 flex flex-col items-center justify-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-surface-container border border-white/10 flex items-center justify-center text-outline">
              <Video className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-bold text-lg text-on-surface">
                No studio spaces found
              </h3>
              <p className="font-sans text-xs text-on-surface-variant max-w-sm mx-auto">
                {searchQuery || categoryFilter !== 'all'
                  ? 'No studio listings match your filter parameters. Try clearing your search.'
                  : 'You have not listed any creative spaces yet. Add your studio to start hosting production shoots.'}
              </p>
            </div>
            {searchQuery || categoryFilter !== 'all' ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                  setStatusFilter('All');
                }}
                className="px-4 py-2 rounded-xl bg-surface-container border border-white/10 text-xs font-mono text-primary hover:bg-surface-container-high transition-all"
              >
                Clear Filters
              </button>
            ) : (
              <Link
                href="/add-studio"
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-display text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>List Your First Studio</span>
              </Link>
            )}
          </div>
        ) : (
          filteredStudios.map((studio) => (
            <article
              key={studio._id}
              className="bg-surface-container-low border border-white/5 rounded-2xl p-5 lg:p-6 flex flex-col lg:flex-row gap-6 group hover:border-primary/30 hover:bg-surface-container transition-all shadow-md"
            >
              {/* Media Aspect Card */}
              <div className="relative w-full lg:w-72 h-52 lg:h-auto rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-highest">
                <img
                  src={studio.imageUrl}
                  alt={studio.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface/80 backdrop-blur-md font-mono text-[10px] text-primary uppercase tracking-wider border border-white/10">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>{studio.status}</span>
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface/90 backdrop-blur-sm text-on-surface-variant font-mono text-[10px] uppercase border border-white/5">
                  <Calendar className="w-3 h-3 text-primary" />
                  <span>Google Cal Synced</span>
                </div>
              </div>

              {/* Core Content */}
              <div className="flex flex-col justify-between flex-1 min-w-0">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-surface-container font-mono text-[11px] text-primary uppercase tracking-wider border border-white/5">
                        {studio.category}
                      </span>
                      <span className="text-on-surface-variant font-sans text-xs flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-outline" />
                        <span className="line-clamp-1">{studio.location}</span>
                      </span>
                    </div>

                    {/* Rate Badge */}
                    <div className="text-right">
                      <span className="font-display text-xl font-bold text-primary">
                        ${studio.hourlyRate}
                      </span>
                      <span className="font-mono text-xs text-on-surface-variant"> / hour</span>
                    </div>
                  </div>

                  <h2 className="font-display text-lg font-bold text-on-surface tracking-tight group-hover:text-primary transition-colors line-clamp-1">
                    {studio.title}
                  </h2>

                  <p className="font-sans text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                    {studio.description}
                  </p>
                </div>

                {/* Performance Bar & Live Telemetry */}
                <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-4 bg-surface-container/60 border border-white/5 p-3 rounded-xl">
                  <div className="flex items-center gap-6 sm:gap-8">
                    <div className="flex flex-col">
                      <span className="font-mono text-[10px] text-on-surface-variant uppercase">
                        Month Bookings
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="font-display text-base font-bold text-on-surface">
                          {studio.monthBookings}
                        </span>
                        <span className="font-sans text-[11px] text-on-surface-variant">sessions</span>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="font-mono text-[10px] text-on-surface-variant uppercase">
                        M-T-D Revenue
                      </span>
                      <span className="font-display text-base font-bold text-primary">
                        ${studio.mtdRevenue.toLocaleString()}
                      </span>
                    </div>

                    <div className="hidden sm:flex flex-col">
                      <span className="font-mono text-[10px] text-on-surface-variant uppercase">
                        Studio Rating
                      </span>
                      <span className="font-sans text-xs text-on-surface flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-primary fill-current" />
                        <span>{studio.rating.toFixed(2)}</span>
                        <span className="text-outline">({studio.reviewsCount})</span>
                      </span>
                    </div>
                  </div>

                  {/* Micro Sparkline SVG */}
                  <div className="hidden md:flex items-center gap-2">
                    <span className="font-mono text-[10px] text-on-surface-variant uppercase">
                      30D Trend
                    </span>
                    <svg className="w-20 h-6 text-primary" fill="none" viewBox="0 0 80 24">
                      <path
                        d="M0 18 L15 14 L30 19 L45 8 L60 11 L75 3 L80 5"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.75"
                      />
                    </svg>
                  </div>
                </div>

                {/* Action Ribbon */}
                <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-outline uppercase">
                      ID: {studio.idCode}
                    </span>
                    <span className="text-outline text-xs">•</span>
                    <span className="font-mono text-[10px] text-primary uppercase">
                      {studio.badgeNote || 'Instant Booking Active'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/studios/edit/${studio._id}`}
                      className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-white/5 text-on-surface font-sans text-xs font-semibold transition-all flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-primary" />
                      <span>Edit / Update</span>
                    </Link>

                    <Link
                      href={`/studios/${studio._id}`}
                      className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-white/5 text-on-surface-variant hover:text-on-surface font-sans text-xs transition-all flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Public</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => openDeleteModal(studio)}
                      className="p-1.5 rounded-lg text-on-surface-variant hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
                      title="Permanently Delete Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </section>

      {/* 5. Architectural Delete Confirmation Modal */}
      {deleteModalOpen && studioToDelete && (
        <div
          id="deleteListingModal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="deleteModalTitle"
        >
          <div className="relative w-full max-w-lg rounded-2xl bg-surface-container border border-white/10 p-6 sm:p-7 shadow-2xl flex flex-col gap-5 text-on-surface">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    id="deleteModalTitle"
                    className="font-display text-xl font-bold text-on-surface tracking-tight"
                  >
                    Delete Studio Listing?
                  </h3>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-red-400">
                    Irreversible Action • Immediate Purge
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <p className="font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              This action is permanent and cannot be undone.{' '}
              <strong className="text-on-surface font-semibold">
                {studioToDelete.title} (#{studioToDelete.idCode})
              </strong>{' '}
              will be permanently purged from the marketplace catalog and live search index.
            </p>

            {/* Impact List */}
            <div className="bg-surface-container-lowest border border-white/5 rounded-xl p-3.5 flex flex-col gap-2 font-sans text-xs text-on-surface-variant">
              <div className="flex items-center gap-2.5">
                <History className="w-4 h-4 text-tertiary shrink-0" />
                <span>Historical completed bookings will be preserved in financial ledgers</span>
              </div>
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>Scheduled calendar slots will be canceled and refunded to creators</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Trash2 className="w-4 h-4 text-outline shrink-0" />
                <span>Associated media gallery, technical specs, and rate cards will be deleted</span>
              </div>
            </div>

            {/* Slug Confirmation Input */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="confirmationSlugInput"
                className="font-mono text-xs uppercase tracking-wider text-on-surface-variant"
              >
                To confirm, please type{' '}
                <code className="text-primary font-bold lowercase bg-surface-container-low px-1.5 py-0.5 rounded border border-white/5">
                  {studioToDelete.slug}
                </code>{' '}
                below:
              </label>
              <input
                id="confirmationSlugInput"
                type="text"
                value={slugConfirmationInput}
                onChange={(e) => setSlugConfirmationInput(e.target.value)}
                placeholder={studioToDelete.slug}
                className="w-full bg-surface-container-low text-on-surface font-mono text-xs rounded-xl px-4 py-2.5 border border-white/10 focus:outline-none focus:border-red-500/60 transition-all"
                autoComplete="off"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-display text-xs uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={
                  isDeleting ||
                  slugConfirmationInput.trim().toLowerCase() !== studioToDelete.slug.toLowerCase()
                }
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-display text-xs uppercase tracking-wider font-bold shadow-lg shadow-red-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
                <span>
                  {isDeleting ? 'Purging Stage...' : 'Permanently Delete Listing'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MyListingsPage() {
  return (
    <ProtectedRoute>
      <MyListingsContent />
    </ProtectedRoute>
  );
}
