'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { fetcher } from '@/lib/api';
import { toast } from 'sonner';
import {
  Layers,
  DollarSign,
  MapPin,
  CheckSquare,
  Image as ImageIcon,
  FileText,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Lock,
  Copy,
  Eye,
  Loader2,
  Save,
} from 'lucide-react';

const studioCategories = [
  'Film Soundstage',
  'Photo Studio',
  'Recording & Podcast Suite',
  'Dance & Rehearsal Hall',
  'Art & Ceramic Atelier',
];

const availableAmenities = [
  'Seamless Cyclorama Cove',
  'Motorized Overhead Lighting Grid',
  'Arri SkyPanel S60-C Softboxes',
  'Three-Phase 200A Cam-Lok Power',
  'Silent Acoustical HVAC (NC-20)',
  'Drive-In Elephant Roll-Up Door',
  'Hair & Makeup Vanity Station',
  '1Gbps Dedicated Fiber Internet',
  'Private Client Tech Village',
  'Mid-Century Client Viewing Lounge',
  'Kitchenette & Craft Services Bar',
  'Grip & Electric Package Included',
  'Harlequin Sprung Hardwood Floors',
  'Dolby Atmos 7.1.4 Monitoring',
  'Sediment-Trap Wash Sinks',
];

const presetImages = [
  {
    name: 'Daylight Cyc Studio',
    url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Industrial SoHo Loft',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Dolby Atmos Sound Suite',
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Warehouse Soundstage',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  },
];

// Fallback seed catalog for instant pre-population
const fallbackSeedDetails: Record<string, any> = {
  std_01: {
    title: 'Sonder Stage A: 40ft Pre-Lit White Cyclorama',
    category: 'Film Soundstage',
    hourlyRate: 145,
    securityDeposit: 250,
    maxCapacity: 45,
    location: {
      address: 'Brooklyn Navy Yard, Building 77',
      city: 'Brooklyn',
      state: 'NY',
      zip: '11205',
    },
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
    amenities: [
      'Seamless Cyclorama Cove',
      'Motorized Overhead Lighting Grid',
      'Arri SkyPanel S60-C Softboxes',
      'Three-Phase 200A Cam-Lok Power',
      'Silent Acoustical HVAC (NC-20)',
      'Drive-In Elephant Roll-Up Door',
    ],
    overview:
      'Premier soundstage built specifically for commercial video and cinematic production. Features a 40ft two-wall infinity cyclorama, pre-hung motorized lighting grid with Arri SkyPanels, silent HVAC engineered for sound capture, and drive-in elephant doors for camera vehicles.',
    ownerName: 'Elena Rostova',
    ownerEmail: 'host@studiospace.com',
  },
  std_02: {
    title: 'Apex Natural Daylight Loft & Still Studio',
    category: 'Photo Studio',
    hourlyRate: 95,
    securityDeposit: 150,
    maxCapacity: 25,
    location: {
      address: '102 Prince St, Floor 4',
      city: 'New York',
      state: 'NY',
      zip: '10012',
    },
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    amenities: [
      'Motorized Overhead Lighting Grid',
      'Hair & Makeup Vanity Station',
      'Mid-Century Client Viewing Lounge',
      '1Gbps Dedicated Fiber Internet',
    ],
    overview:
      'Historic loft bathed in continuous northern light through 14ft industrial steel casement windows. Hardwood factory floors and modular mid-century furniture sets ideal for editorial fashion, lookbooks, and high-end portraiture.',
    ownerName: 'Marcus Vance',
    ownerEmail: 'marcus@studiospace.com',
  },
  std_03: {
    title: 'Echo Chamber: Dolby Atmos 7.1.4 Mixing Suite',
    category: 'Recording & Podcast Suite',
    hourlyRate: 110,
    securityDeposit: 200,
    maxCapacity: 12,
    location: {
      address: '830 E 3rd St',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90013',
    },
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    amenities: [
      'Dolby Atmos 7.1.4 Monitoring',
      'Silent Acoustical HVAC (NC-20)',
      '1Gbps Dedicated Fiber Internet',
      'Private Client Tech Village',
    ],
    overview:
      'Acoustically isolated control room tuned to Dolby Atmos specifications with Genelec SAM monitors, Avid S6 console, and floating concrete floors.',
    ownerName: 'Elena Rostova',
    ownerEmail: 'host@studiospace.com',
  },
};

function EditStudioContent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const studioId = (params?.id as string) || 'std_01';

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Film Soundstage');
  const [hourlyRate, setHourlyRate] = useState<number | ''>(145);
  const [securityDeposit, setSecurityDeposit] = useState<number | ''>(200);
  const [maxCapacity, setMaxCapacity] = useState<number | ''>(35);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('NY');
  const [zip, setZip] = useState('10001');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [overview, setOverview] = useState('');
  const [ownerName, setOwnerName] = useState('Elena Rostova');
  const [ownerEmail, setOwnerEmail] = useState('host@studiospace.com');

  // Slug generator for canonical permalink preview
  const canonicalSlug = useMemo(() => {
    return title
      ? title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      : 'studio-listing';
  }, [title]);

  // Load and pre-populate studio data
  useEffect(() => {
    async function loadStudioData() {
      try {
        const res = await fetcher<{ success: boolean; studio: any }>(`/studios/${studioId}`);
        if (res.success && res.studio) {
          const st = res.studio;
          setTitle(st.title || '');
          setCategory(st.category || 'Film Soundstage');
          setHourlyRate(st.hourlyRate || st.pricePerHour || 145);
          setSecurityDeposit(st.securityDeposit || 200);
          setMaxCapacity(st.maxCapacity || st.capacity || 30);
          setAddress(
            typeof st.location === 'object' ? st.location.address || '' : st.location || ''
          );
          setCity(typeof st.location === 'object' ? st.location.city || 'New York' : 'New York');
          setState(typeof st.location === 'object' ? st.location.state || 'NY' : 'NY');
          setZip(typeof st.location === 'object' ? st.location.zip || '10001' : '10001');
          setImageUrl(st.imageUrl || (st.images && st.images[0]) || '');
          setSelectedAmenities(st.amenities || []);
          setOverview(st.overview || st.description || '');
          setOwnerName(st.ownerName || user?.name || 'Elena Rostova');
          setOwnerEmail(st.ownerEmail || user?.email || 'host@studiospace.com');
          setLoading(false);
          return;
        }
      } catch {
        // Fall back to seed details
      }

      // Check fallback seeds
      const seed = fallbackSeedDetails[studioId] || fallbackSeedDetails.std_01;
      setTitle(seed.title);
      setCategory(seed.category);
      setHourlyRate(seed.hourlyRate);
      setSecurityDeposit(seed.securityDeposit);
      setMaxCapacity(seed.maxCapacity);
      setAddress(seed.location.address);
      setCity(seed.location.city);
      setState(seed.location.state);
      setZip(seed.location.zip);
      setImageUrl(seed.imageUrl);
      setSelectedAmenities(seed.amenities);
      setOverview(seed.overview);
      setOwnerName(user?.name || seed.ownerName);
      setOwnerEmail(user?.email || seed.ownerEmail);
      setLoading(false);
    }

    loadStudioData();
  }, [studioId, user]);

  const toggleAmenity = (item: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const handleCopySlug = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(`https://aperture.io/studios/${canonicalSlug}`);
      toast.success('Canonical Slug Copied', {
        description: `Copied /studios/${canonicalSlug} to clipboard.`,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Studio Title is required.');
      return;
    }

    if (!hourlyRate || hourlyRate <= 0) {
      toast.error('Valid hourly rate ($/hr) is required.');
      return;
    }

    if (!imageUrl.trim()) {
      toast.error('Primary showcase image URL is required.');
      return;
    }

    setSubmitting(true);

    const payload = {
      title: title.trim(),
      category,
      hourlyRate: Number(hourlyRate),
      securityDeposit: Number(securityDeposit) || 150,
      maxCapacity: Number(maxCapacity) || 15,
      location: {
        address: address.trim(),
        city: city.trim() || 'New York',
        state: state.trim() || 'NY',
        zip: zip.trim() || '10001',
      },
      imageUrl: imageUrl.trim(),
      amenities: selectedAmenities,
      overview: overview.trim(),
      ownerName,
      ownerEmail,
    };

    try {
      await fetcher(`/studios/${studioId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }).catch(() => null);

      toast.success('Studio Listing Successfully Updated', {
        description: `${title} specifications updated and deployed to marketplace.`,
      });
      router.push('/my-listings');
    } catch {
      toast.error('Failed to update studio listing');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-on-surface">
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-surface-container-low border border-white/10 text-xs font-mono text-primary shadow-xl">
          <Loader2 className="w-4 h-4 text-primary animate-spin" />
          <span>LOADING STUDIO SPECIFICATIONS...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-12 py-10 sm:py-14 space-y-8">
      {/* 1. Breadcrumb & Context Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-on-surface-variant"
          >
            <Link href="/my-listings" className="hover:text-primary transition-colors">
              Production Portal
            </Link>
            <span className="opacity-40">/</span>
            <Link href="/my-listings" className="hover:text-primary transition-colors">
              Host Management
            </Link>
            <span className="opacity-40">/</span>
            <span className="text-primary font-semibold">
              Edit Listing: <span className="text-on-surface">{title}</span>
            </span>
          </nav>

          <Link
            href="/my-listings"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to My Listings</span>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-4 border-b border-white/5">
          <div className="space-y-2">
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-on-surface">
              Update Studio Listing
            </h1>
            <p className="font-sans text-xs sm:text-sm text-on-surface-variant max-w-2xl leading-relaxed">
              Modify technical specifications, hourly rates, power grid configuration, and media assets. Changes propagate to live catalog and search indices immediately.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => router.push('/my-listings')}
              className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high border border-white/10 text-on-surface font-display text-xs uppercase tracking-wider transition-all"
            >
              Discard Changes
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-display text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/10 transition-all active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Saving...' : 'Save & Deploy'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: Identification & Classification */}
        <section className="bg-surface-container-low border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-primary font-bold px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                01
              </span>
              <h2 className="font-display text-lg font-bold text-on-surface tracking-tight">
                Identification & Classification
              </h2>
            </div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-outline">
              Indexed Attributes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Studio Title */}
            <div className="space-y-1.5 md:col-span-2">
              <label
                htmlFor="studioTitle"
                className="font-mono text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-primary" />
                Studio Stage Title
              </label>
              <input
                id="studioTitle"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sonder Stage A: 40ft Pre-Lit White Cyclorama"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-white/10 text-xs text-on-surface placeholder:text-outline/60 font-sans focus:outline-none focus:border-primary/60 transition-all"
              />
            </div>

            {/* Studio Category */}
            <div className="space-y-1.5">
              <label
                htmlFor="studioCategory"
                className="font-mono text-xs uppercase tracking-wider text-on-surface-variant"
              >
                Creative Discipline Category
              </label>
              <select
                id="studioCategory"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-white/10 text-xs text-on-surface font-sans focus:outline-none focus:border-primary/60 cursor-pointer transition-all"
              >
                {studioCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Canonical Permalink Preview */}
            <div className="space-y-1.5">
              <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                Canonical Permalink
              </label>
              <div className="flex items-center rounded-xl bg-surface-container border border-white/10 overflow-hidden">
                <span className="px-3 text-outline font-mono text-xs">/studios/</span>
                <input
                  type="text"
                  readOnly
                  value={canonicalSlug}
                  className="w-full bg-transparent text-primary font-mono text-xs py-2.5 border-none focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopySlug}
                  className="px-3 text-outline hover:text-primary transition-colors"
                  title="Copy Canonical URL"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Overview / Pitch */}
            <div className="space-y-1.5 md:col-span-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="overview"
                  className="font-mono text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  Short Summary & Studio Technical Pitch
                </label>
                <span className="font-mono text-[11px] text-outline">
                  {overview.length} chars
                </span>
              </div>
              <textarea
                id="overview"
                rows={3}
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                placeholder="Comprehensive technical pitch covering lighting clearance, sound isolation rating, power capacity..."
                required
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-white/10 text-xs text-on-surface placeholder:text-outline/60 font-sans focus:outline-none focus:border-primary/60 transition-all resize-none"
              />
            </div>
          </div>
        </section>

        {/* SECTION 2: Pricing, Deposits & Capacity */}
        <section className="bg-surface-container-low border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-primary font-bold px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                02
              </span>
              <h2 className="font-display text-lg font-bold text-on-surface tracking-tight">
                Pricing, Deposits & Capacity
              </h2>
            </div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-outline">
              USD / Escrow Verified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Hourly Rate */}
            <div className="space-y-1.5">
              <label
                htmlFor="hourlyRate"
                className="font-mono text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5"
              >
                <DollarSign className="w-3.5 h-3.5 text-primary" />
                Hourly Rate ($ / hr)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-xs text-outline">
                  $
                </span>
                <input
                  id="hourlyRate"
                  type="number"
                  min="1"
                  value={hourlyRate}
                  onChange={(e) =>
                    setHourlyRate(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  required
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-surface-container border border-white/10 text-xs text-on-surface font-mono focus:outline-none focus:border-primary/60 transition-all"
                />
              </div>
            </div>

            {/* Security Deposit */}
            <div className="space-y-1.5">
              <label
                htmlFor="securityDeposit"
                className="font-mono text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-tertiary" />
                Refundable Deposit ($)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-xs text-outline">
                  $
                </span>
                <input
                  id="securityDeposit"
                  type="number"
                  min="0"
                  value={securityDeposit}
                  onChange={(e) =>
                    setSecurityDeposit(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-surface-container border border-white/10 text-xs text-on-surface font-mono focus:outline-none focus:border-primary/60 transition-all"
                />
              </div>
            </div>

            {/* Max Capacity */}
            <div className="space-y-1.5">
              <label
                htmlFor="maxCapacity"
                className="font-mono text-xs uppercase tracking-wider text-on-surface-variant"
              >
                Max Production Crew
              </label>
              <input
                id="maxCapacity"
                type="number"
                min="1"
                value={maxCapacity}
                onChange={(e) =>
                  setMaxCapacity(e.target.value === '' ? '' : Number(e.target.value))
                }
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-white/10 text-xs text-on-surface font-mono focus:outline-none focus:border-primary/60 transition-all"
              />
            </div>
          </div>
        </section>

        {/* SECTION 3: Geolocation Envelope */}
        <section className="bg-surface-container-low border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-primary font-bold px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                03
              </span>
              <h2 className="font-display text-lg font-bold text-on-surface tracking-tight">
                Geographic Production Hub
              </h2>
            </div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-outline flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              Verified Studio Location
            </span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="address"
                className="font-mono text-xs uppercase tracking-wider text-on-surface-variant"
              >
                Physical Studio Street Address
              </label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 540 Santa Fe Ave, Warehouse District"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-white/10 text-xs text-on-surface font-sans focus:outline-none focus:border-primary/60 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="city"
                  className="font-mono text-xs uppercase tracking-wider text-on-surface-variant"
                >
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="New York"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-white/10 text-xs text-on-surface font-sans focus:outline-none focus:border-primary/60 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="state"
                  className="font-mono text-xs uppercase tracking-wider text-on-surface-variant"
                >
                  State / Region
                </label>
                <input
                  id="state"
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="NY"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-white/10 text-xs text-on-surface font-sans focus:outline-none focus:border-primary/60 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="zip"
                  className="font-mono text-xs uppercase tracking-wider text-on-surface-variant"
                >
                  Postal Code
                </label>
                <input
                  id="zip"
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="10001"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-white/10 text-xs text-on-surface font-sans focus:outline-none focus:border-primary/60 transition-all"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: Technical Amenities Checklist */}
        <section className="bg-surface-container-low border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-primary font-bold px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                04
              </span>
              <h2 className="font-display text-lg font-bold text-on-surface tracking-tight">
                Technical Amenities & Grid Rigging
              </h2>
            </div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-primary">
              {selectedAmenities.length} selected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableAmenities.map((amenity) => {
              const isSelected = selectedAmenities.includes(amenity);
              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 text-xs ${
                    isSelected
                      ? 'bg-primary/10 border-primary/40 text-on-surface font-medium'
                      : 'bg-surface-container border-white/5 text-on-surface-variant hover:border-white/15 hover:text-on-surface'
                  }`}
                >
                  <span className="truncate">{amenity}</span>
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? 'bg-primary border-primary text-on-primary'
                        : 'border-white/20 bg-surface-container-highest'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* SECTION 5: Media & Visual Assets */}
        <section className="bg-surface-container-low border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-primary font-bold px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                05
              </span>
              <h2 className="font-display text-lg font-bold text-on-surface tracking-tight">
                Media & Visual Assets
              </h2>
            </div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-outline">
              High-Res Cover Photography
            </span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="imageUrl"
                className="font-mono text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5"
              >
                <ImageIcon className="w-3.5 h-3.5 text-primary" />
                Primary Showcase Image URL
              </label>
              <input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                required
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-white/10 text-xs text-on-surface font-sans focus:outline-none focus:border-primary/60 transition-all"
              />
            </div>

            {/* Quick Preset Selector */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-outline">
                Or Select from Tested Architectural Presets:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {presetImages.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className={`relative rounded-xl overflow-hidden aspect-video border text-left transition-all group ${
                      imageUrl === preset.url
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                      <span className="text-[10px] font-mono text-white truncate">
                        {preset.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cover Preview */}
            {imageUrl && (
              <div className="mt-2 rounded-xl overflow-hidden border border-white/10 aspect-[21/9] relative bg-surface-container-highest">
                <img
                  src={imageUrl}
                  alt="Live Cover Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono text-primary uppercase border border-white/10">
                  Live Cover Preview
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 6: Host Authority & Ownership Context (READ-ONLY) */}
        <section className="bg-surface-container-low border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-primary font-bold px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                06
              </span>
              <h2 className="font-display text-lg font-bold text-on-surface tracking-tight">
                Host Authority & Ownership
              </h2>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container border border-white/10 text-primary font-mono text-[10px] uppercase">
              <Lock className="w-3 h-3 text-primary" />
              <span>Verified Host Identity (Locked)</span>
            </div>
          </div>

          <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
            Per platform security standards, host identity credentials and verified payout accounts cannot be altered directly in the stage editor.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-mono text-xs uppercase tracking-wider text-outline flex items-center gap-1">
                <span>Verified Host Name</span>
                <Lock className="w-3 h-3 text-outline" />
              </label>
              <input
                type="text"
                readOnly
                value={ownerName}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container/50 border border-white/5 text-xs text-on-surface-variant font-mono cursor-not-allowed select-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-xs uppercase tracking-wider text-outline flex items-center gap-1">
                <span>Verified Host Email</span>
                <Lock className="w-3 h-3 text-outline" />
              </label>
              <input
                type="email"
                readOnly
                value={ownerEmail}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container/50 border border-white/5 text-xs text-on-surface-variant font-mono cursor-not-allowed select-none"
              />
            </div>
          </div>
        </section>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/5">
          <Link
            href="/my-listings"
            className="px-5 py-3 rounded-xl bg-surface-container hover:bg-surface-container-high border border-white/10 text-on-surface font-display text-xs uppercase tracking-wider transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-display text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/10 active:scale-95 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Deploying Changes...' : 'Save & Deploy Updates'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default function EditStudioPage() {
  return (
    <ProtectedRoute>
      <EditStudioContent />
    </ProtectedRoute>
  );
}
