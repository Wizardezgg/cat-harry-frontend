'use client';

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { StudioCard } from '@/components/studios/StudioCard';
import { StudioGridSkeleton } from '@/components/studios/StudioSkeleton';
import { IStudio } from '@/types';
import { fetcher } from '@/lib/api';
import { Search, SlidersHorizontal, ArrowUpDown, X, Sparkles } from 'lucide-react';

const fallbackStudios: any[] = [
  {
    _id: 'std_01',
    title: 'Sonder Stage A: 40ft Pre-Lit White Cyclorama',
    category: 'Film Soundstage',
    hourlyRate: 145,
    maxCapacity: 45,
    location: 'Brooklyn Navy Yard, NY',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
    amenities: ['40ft Seamless Cyclorama', 'Arri SkyPanels', '200A Cam-Lok Power', 'Silent HVAC'],
    rating: 4.95,
    reviewCount: 38,
    featured: true,
  },
  {
    _id: 'std_02',
    title: 'Apex Natural Daylight Loft & Still Studio',
    category: 'Photo Studio',
    hourlyRate: 95,
    maxCapacity: 25,
    location: 'SoHo Cast Iron District, NY',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    amenities: ['Continuous North Daylight', '14ft Ceilings', 'Profoto B10X Kit', 'Maple Plank Floors'],
    rating: 4.91,
    reviewCount: 44,
    featured: true,
  },
  {
    _id: 'std_03',
    title: 'Echo Chamber: Dolby Atmos 7.1.4 Mixing Suite',
    category: 'Recording & Podcast Suite',
    hourlyRate: 110,
    maxCapacity: 12,
    location: 'Arts District, Los Angeles, CA',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
    amenities: ['Dolby Atmos 7.1.4', 'Genelec SAM', 'Neumann U87 Mics', 'Floating Acoustic Floor'],
    rating: 4.98,
    reviewCount: 29,
    featured: true,
  },
  {
    _id: 'std_04',
    title: 'Warehouse 47 Industrial Daylight & Concrete Studio',
    category: 'Film Soundstage',
    hourlyRate: 130,
    maxCapacity: 60,
    location: 'West Loop, Chicago, IL',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    amenities: ['Drive-In Vehicle Access', 'Polished Concrete', '400A Heavy Distribution', 'Full Sound System'],
    rating: 4.88,
    reviewCount: 31,
    featured: true,
  },
  {
    _id: 'std_05',
    title: 'Solstice Sprung-Wood Movement & Dance Rehearsal Hall',
    category: 'Dance & Rehearsal Hall',
    hourlyRate: 75,
    maxCapacity: 35,
    location: 'Mission District, San Francisco, CA',
    imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
    amenities: ['Harlequin Sprung Hardwood', '30ft Continuous Mirror Wall', 'High-Power Bluetooth PA'],
    rating: 4.93,
    reviewCount: 22,
    featured: false,
  },
  {
    _id: 'std_06',
    title: 'Komorebi Sunlit Ceramic Atelier & Fine Arts Loft',
    category: 'Art & Ceramic Atelier',
    hourlyRate: 65,
    maxCapacity: 18,
    location: 'South Congress, Austin, TX',
    imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80',
    amenities: ['Shimpo Electric Wheels', 'Clay Slab Roller', 'Deep Stainless Slurry Sinks'],
    rating: 4.96,
    reviewCount: 19,
    featured: false,
  },
  {
    _id: 'std_07',
    title: 'Neon Noir Cyberpunk Sound & Film Stage',
    category: 'Film Soundstage',
    hourlyRate: 155,
    maxCapacity: 40,
    location: 'Williamsburg, Brooklyn, NY',
    imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
    amenities: ['DMX RGB Tube Matrix', 'Gloss Reflective Epoxy Floor', 'Martin Fog Generator'],
    rating: 4.97,
    reviewCount: 35,
    featured: true,
  },
  {
    _id: 'std_08',
    title: 'The Greenhouse Glass-Roof Photo Studio',
    category: 'Photo Studio',
    hourlyRate: 105,
    maxCapacity: 20,
    location: 'Capitol Hill, Seattle, WA',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    amenities: ['Pitched Conservatory Roof', 'Living Exotic Plants', 'UV Diffusion Silk Screens'],
    rating: 4.94,
    reviewCount: 27,
    featured: false,
  },
];

const categoryTabs = [
  'All Spaces',
  'Photo Studio',
  'Film Soundstage',
  'Recording & Podcast Suite',
  'Dance & Rehearsal Hall',
  'Art & Ceramic Atelier',
];

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [studios, setStudios] = useState<IStudio[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All Spaces');
  const [sortBy, setSortBy] = useState('recommended');
  const [maxPrice, setMaxPrice] = useState<number>(200);

  // Sync category from URL if changed externally
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setCategory(cat);
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadStudios() {
      try {
        const res = await fetcher<{ success: boolean; studios: IStudio[] }>('/studios');
        if (res.success && res.studios && res.studios.length > 0) {
          setStudios(res.studios);
        } else {
          setStudios(fallbackStudios as IStudio[]);
        }
      } catch {
        setStudios(fallbackStudios as IStudio[]);
      } finally {
        setLoading(false);
      }
    }
    loadStudios();
  }, []);

  // Filter & Sorting Logic
  const filteredStudios = useMemo(() => {
    return studios
      .filter((studio) => {
        // Category Filter
        if (category !== 'All Spaces') {
          const studioCat = String(studio.category || '');
          const catMatch =
            studioCat.toLowerCase() === category.toLowerCase() ||
            (category.includes('Photo') && studioCat.includes('Photo')) ||
            (category.includes('Film') && studioCat.includes('Film')) ||
            (category.includes('Podcast') && (studioCat.includes('Podcast') || studioCat.includes('Recording'))) ||
            (category.includes('Dance') && studioCat.includes('Dance')) ||
            (category.includes('Art') && studioCat.includes('Art'));
          if (!catMatch) return false;
        }

        // Search Filter (Title or Location/City)
        if (search.trim()) {
          const q = search.toLowerCase();
          const titleMatch = studio.title.toLowerCase().includes(q);
          const rawLoc: any = studio.location;
          const locStr =
            typeof rawLoc === 'string'
              ? rawLoc.toLowerCase()
              : `${rawLoc?.city || ''} ${rawLoc?.address || ''}`.toLowerCase();
          const locationMatch = locStr.includes(q);
          if (!titleMatch && !locationMatch) return false;
        }

        // Price Filter
        const price = studio.hourlyRate || (studio as any).pricePerHour || 0;
        if (price > maxPrice) return false;

        return true;
      })
      .sort((a, b) => {
        const priceA = a.hourlyRate || (a as any).pricePerHour || 0;
        const priceB = b.hourlyRate || (b as any).pricePerHour || 0;
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;

        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'rating') return ratingB - ratingA;
        return 0; // recommended / default
      });
  }, [studios, search, category, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All Spaces');
    setSortBy('recommended');
    setMaxPrice(200);
    router.push('/studios');
  };

  return (
    <div className="w-full min-h-screen bg-surface px-6 lg:px-12 py-10 max-w-7xl mx-auto space-y-8">
      
      {/* Page Title & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-outline uppercase tracking-wider mb-2">
            <span>Aperture</span>
            <span>/</span>
            <span className="text-primary">Studio Directory</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-on-surface">
            Explore Creative Studios
          </h1>
          <p className="text-sm text-on-surface-variant font-sans mt-1">
            Browse {filteredStudios.length} production soundstages, daylight lofts, and suites
          </p>
        </div>

        {/* Search Bar in Header */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-outline absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by cyc, city, audio..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-white/10 rounded-xl text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary/60 transition-all font-sans"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-3 text-outline hover:text-on-surface"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Categories Horizontal Scrolling Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categoryTabs.map((tab) => {
          const isSelected = category === tab;
          return (
            <button
              key={tab}
              onClick={() => setCategory(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-primary text-on-primary border-primary shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant border-white/5 hover:border-white/20 hover:text-on-surface'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Control Strip: Max Price Slider & Sort Dropdown */}
      <div className="p-4 rounded-2xl bg-surface-container-low border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Price Filter */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-outline">
            <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
            <span>Max Rate:</span>
            <span className="font-bold text-primary">${maxPrice}/hr</span>
          </div>
          <input
            type="range"
            min="50"
            max="200"
            step="10"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-36 accent-[#ffcd8b] cursor-pointer"
          />
        </div>

        {/* Sort & Quick Reset */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-outline" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 bg-surface-container-high border border-white/10 rounded-lg text-xs text-on-surface focus:outline-none cursor-pointer font-sans"
            >
              <option value="recommended">Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {(search || category !== 'All Spaces' || maxPrice < 200 || sortBy !== 'recommended') && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-primary hover:underline px-2 py-1 font-mono"
            >
              Clear Filters
            </button>
          )}
        </div>

      </div>

      {/* Studios Grid */}
      {loading ? (
        <StudioGridSkeleton count={6} />
      ) : filteredStudios.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudios.map((studio) => (
            <StudioCard key={studio._id} studio={studio} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center rounded-3xl bg-surface-container-low border border-dashed border-white/10 flex flex-col items-center justify-center p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-surface-container-high border border-white/10 flex items-center justify-center text-outline">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-semibold text-lg text-on-surface">
              No creative spaces match your filter criteria
            </h3>
            <p className="text-xs text-on-surface-variant max-w-sm">
              Try adjusting your price range, clearing search terms, or exploring all disciplines.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-primary text-on-primary font-medium text-xs hover:bg-primary-container transition-all"
          >
            Reset All Filters
          </button>
        </div>
      )}

    </div>
  );
}

export default function ExploreStudiosPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-12"><StudioGridSkeleton count={6} /></div>}>
      <ExploreContent />
    </Suspense>
  );
}
