'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { IStudio } from '@/types';
import { fetcher } from '@/lib/api';
import { BookingModal } from '@/components/booking/BookingModal';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import {
  MapPin,
  Users,
  Star,
  Heart,
  Share2,
  Calendar,
  Clock,
  ShieldCheck,
  Check,
  Zap,
  VolumeX,
  Maximize2,
  Truck,
  ArrowLeft,
  Sparkles,
  Phone,
  Mail,
  CheckCircle2,
} from 'lucide-react';

const studioDataset: any[] = [
  {
    _id: 'std_01',
    title: 'Sonder Stage A: 40ft Pre-Lit White Cyclorama',
    description:
      'Premier soundstage built specifically for commercial video and cinematic production. Features a 40ft two-wall infinity cyclorama, pre-hung motorized lighting grid with Arri SkyPanels, silent HVAC engineered for sound capture, and drive-in elephant doors for camera vehicles.',
    category: 'Film Soundstage',
    hourlyRate: 145,
    securityDeposit: 250,
    location: {
      address: 'Building 77, Brooklyn Navy Yard',
      city: 'Brooklyn',
      state: 'NY',
      zip: '11205',
    },
    images: [
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
    ],
    amenities: [
      '40ft Seamless Cyclorama',
      'Arri SkyPanel S60-C Lighting Grid',
      'Three-Phase 200A Cam-Lok Power',
      'Silent Acoustical HVAC (NC-20)',
      'Elephant Roll-Up Drive-In Door',
      'Hair & Makeup Wardrobe Lounge',
      '1Gbps Dedicated Fiber Internet',
      'Private Client Tech Village',
      'Kitchenette & Craft Services Bar',
      'Grip Package (C-Stands, Sandbags, Combos)',
    ],
    rules: [
      'Floor repainting fee applies if colored gels or vehicle tires stain the cyclorama cove.',
      'No pyrotechnics or open flames without prior fire marshal clearance.',
      'Overtime starts promptly at 15 minutes past contracted wrap time.',
      'All trash must be bagged and placed in designated dumpster bins.',
    ],
    sqft: 4200,
    ceilingHeight: '18ft clearance to grid',
    maxCapacity: 45,
    rating: 4.95,
    reviewCount: 38,
    ownerName: 'Elena Rostova',
    ownerRole: 'PRO Verified Host & Director',
    ownerPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    ownerEmail: 'elena@studiospace.com',
    ownerPhone: '+1 (718) 555-0192',
    memberSince: 'Member since 2023',
    responseTime: 'Responds within 15 minutes',
  },
  {
    _id: 'std_02',
    title: 'Apex Natural Daylight Loft & Still Studio',
    description:
      'Historic loft bathed in continuous northern light through 14ft industrial steel casement windows. Hardwood factory floors, exposed brick accents, and modular mid-century furniture sets ideal for editorial fashion, lookbooks, and high-end portraiture.',
    category: 'Photo Studio',
    hourlyRate: 95,
    securityDeposit: 150,
    location: {
      address: '102 Prince St, SoHo Cast Iron District',
      city: 'New York',
      state: 'NY',
      zip: '10012',
    },
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1000&q=80',
    ],
    amenities: [
      'Continuous North-Facing Natural Daylight',
      '14ft Vaulted Ceilings',
      'Profoto B10X Lighting Kit Included',
      'Original 1920s Maple Plank Floors',
      'Blackout Motorized Shades',
      'Steamer, Wardrobe Racks & Ironing Station',
      'Espresso & Refreshment Bar',
      'Passenger & Freight Elevator Access',
    ],
    rules: [
      'No glitter or fine powder without protective floor drop cloths.',
      'Shoe booties required on freshly sanded maple floors.',
      'Freight elevator must be reserved 24h prior for heavy equipment.',
    ],
    sqft: 2400,
    ceilingHeight: '14ft ceiling clearance',
    maxCapacity: 25,
    rating: 4.91,
    reviewCount: 44,
    ownerName: 'Marcus Vance',
    ownerRole: 'Commercial Photographer',
    ownerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    ownerEmail: 'marcus@studiospace.com',
    ownerPhone: '+1 (212) 555-0144',
    memberSince: 'Member since 2022',
    responseTime: 'Responds within 30 minutes',
  },
  {
    _id: 'std_03',
    title: 'Echo Chamber: Dolby Atmos 7.1.4 Mixing Suite',
    description:
      'Acoustically tuned control room certified for Dolby Atmos spatial audio mastering, vocal tracking, and multi-cam podcast broadcast. Features Genelec Smart Active Monitoring, Neumann U87 microphones, and four Blackmagic 6K Pro cameras with teleprompters.',
    category: 'Recording & Podcast Suite',
    hourlyRate: 110,
    securityDeposit: 200,
    location: {
      address: '830 E 3rd St, Arts District',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90013',
    },
    images: [
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80',
    ],
    amenities: [
      'Dolby Atmos 7.1.4 Genelec SAM System',
      '4x Neumann U87 & Shure SM7B Microphones',
      '4K Multi-Cam Live Video Switcher (ATEM Mini)',
      'Floating Floor Acoustic Isolation (NC-15)',
      'Universal Audio Apollo x16 Converters',
      'Vocal Booth with Visual Sightline',
      'Live Streaming Dedicated Fiber Output',
    ],
    rules: [
      'No open drink containers near the analog console.',
      'Only licensed audio engineers may patch rack gear without supervision.',
      'Sound isolation door must stay sealed during tracking sessions.',
    ],
    sqft: 1650,
    ceilingHeight: '12ft acoustic treatment',
    maxCapacity: 12,
    rating: 4.98,
    reviewCount: 29,
    ownerName: 'Kai Takahashi',
    ownerRole: 'Sound Designer & Engineer',
    ownerPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    ownerEmail: 'kai@studiospace.com',
    ownerPhone: '+1 (213) 555-0182',
    memberSince: 'Member since 2023',
    responseTime: 'Responds within 1 hour',
  },
  {
    _id: 'std_04',
    title: 'Warehouse 47 Industrial Daylight & Concrete Studio',
    description:
      'Raw industrial warehouse with polished concrete floors, steel gantry crane, and textured distressed masonry walls. High ceilings with skylights make it the top choice for automotive shoots, large set builds, music videos, and fashion campaigns.',
    category: 'Film Soundstage',
    hourlyRate: 130,
    securityDeposit: 250,
    location: {
      address: '1140 W Fulton Market, West Loop',
      city: 'Chicago',
      state: 'IL',
      zip: '60607',
    },
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80',
    ],
    amenities: [
      'Ground-Floor Vehicle Drive-In Access',
      'Polished Industrial Concrete Flooring',
      '400A Heavy Duty Distribution Box',
      'Full Sound System & Bluetooth Playback',
      'Dual Hair, Makeup & Wardrobe Stations',
      'Kitchenette & Craft Services Bar',
      'Private On-Site Parking for 10 Vehicles',
    ],
    rules: [
      'Vehicle engines must be shut off immediately after positioning.',
      'Tape must be gaffer tape only — no duct tape on concrete.',
    ],
    sqft: 5000,
    ceilingHeight: '22ft clear span',
    maxCapacity: 60,
    rating: 4.88,
    reviewCount: 31,
    ownerName: 'Sarah Jenkins',
    ownerRole: 'Production Stage Manager',
    ownerPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    ownerEmail: 'sarah@studiospace.com',
    ownerPhone: '+1 (312) 555-0167',
    memberSince: 'Member since 2021',
    responseTime: 'Responds within 10 minutes',
  },
];

export default function StudioDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const studioId = params?.id as string;

  const [studio, setStudio] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  // Widget inputs
  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);
  const [selectedDate, setSelectedDate] = useState(tomorrow);
  const [selectedStart, setSelectedStart] = useState('10:00');
  const [selectedEnd, setSelectedEnd] = useState('14:00');

  useEffect(() => {
    async function loadStudio() {
      try {
        const res = await fetcher<{ success: boolean; studio: IStudio }>(`/studios/${studioId}`);
        if (res.success && res.studio) {
          setStudio(res.studio);
          setActiveImage(res.studio.imageUrl || (res.studio as any).images?.[0] || '');
        } else {
          // Fallback matching
          const found = studioDataset.find((s) => s._id === studioId) || studioDataset[0];
          setStudio(found);
          setActiveImage(found.images?.[0] || found.imageUrl);
        }
      } catch {
        const found = studioDataset.find((s) => s._id === studioId) || studioDataset[0];
        setStudio(found);
        setActiveImage(found.images?.[0] || found.imageUrl);
      } finally {
        setLoading(false);
      }
    }
    loadStudio();
  }, [studioId]);

  // Total Hours & Subtotal
  const hourlyRate = studio?.hourlyRate || studio?.pricePerHour || 95;
  const deposit = studio?.securityDeposit || 150;

  const totalHours = useMemo(() => {
    if (!selectedStart || !selectedEnd) return 0;
    const [startH, startM] = selectedStart.split(':').map(Number);
    const [endH, endM] = selectedEnd.split(':').map(Number);
    const diff = endH + endM / 60 - (startH + startM / 60);
    return diff > 0 ? diff : 0;
  }, [selectedStart, selectedEnd]);

  const subtotal = totalHours * hourlyRate;
  const grandTotal = subtotal + (totalHours > 0 ? deposit : 0);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Studio link copied to clipboard!');
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      toast.info('Please sign in to save studios to your wishlist.');
      return;
    }
    try {
      const res = await fetcher<{ success: boolean; saved: boolean; message: string }>('/wishlists/toggle', {
        method: 'POST',
        body: JSON.stringify({ studioId: studio._id }),
      });
      setWishlisted(res.saved);
      toast.success(res.message);
    } catch {
      setWishlisted(!wishlisted);
      toast.success(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist');
    }
  };

  if (loading || !studio) {
    return (
      <div className="w-full min-h-screen bg-surface px-6 lg:px-12 py-12 max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="h-4 bg-surface-container-high rounded w-48" />
        <div className="h-8 bg-surface-container-high rounded w-96" />
        <div className="h-[460px] bg-surface-container-high rounded-2xl w-full" />
      </div>
    );
  }

  const galleryImages: string[] =
    studio.images || studio.gallery || [studio.imageUrl, studio.imageUrl, studio.imageUrl];

  const displayLocation =
    typeof studio.location === 'string'
      ? studio.location
      : `${studio.location?.address || ''}, ${studio.location?.city || ''}, ${studio.location?.state || ''}`;

  return (
    <div className="w-full min-h-screen bg-surface px-6 lg:px-12 py-8 max-w-7xl mx-auto space-y-8 text-on-surface">
      
      {/* 1. Breadcrumbs & Top Bar Actions Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div className="flex items-center gap-2 text-xs font-mono text-outline">
          <Link href="/studios" className="hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Studios
          </Link>
          <span>/</span>
          <span className="text-primary truncate max-w-xs">{studio.title}</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-surface-container-low hover:bg-surface-container text-xs text-on-surface-variant hover:text-on-surface transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
          <button
            onClick={handleWishlist}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs transition-all ${
              wishlisted
                ? 'bg-rose-500 text-white border-rose-500'
                : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-rose-400'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-current' : ''}`} />
            <span>{wishlisted ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* 2. Editorial Photo Mosaic (1 Large Hero + Contextual Thumbs) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 rounded-2xl overflow-hidden border border-white/10 bg-surface-container-lowest">
        
        {/* Main Hero Photo (7 Cols on desktop) */}
        <div className="lg:col-span-8 relative aspect-[16/10] lg:aspect-auto lg:h-[480px] bg-surface-container-highest overflow-hidden group">
          <img
            src={activeImage || galleryImages[0]}
            alt={studio.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80 pointer-events-none" />

          {/* Badges on Hero */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-surface/85 backdrop-blur-md border border-white/10 text-xs font-mono text-primary font-medium">
              {studio.category}
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono">
            <span className="px-3 py-1 rounded-lg bg-surface/85 backdrop-blur-md border border-white/10 text-on-surface">
              {studio.sqft || 4200} sq ft • {studio.ceilingHeight || '18ft Ceilings'}
            </span>
            <span className="text-on-surface-variant bg-surface/85 px-2.5 py-1 rounded-lg border border-white/5">
              Photo {galleryImages.indexOf(activeImage) + 1 || 1} of {galleryImages.length}
            </span>
          </div>
        </div>

        {/* 4 Contextual Thumbnails (4 Cols on desktop) */}
        <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-2 lg:h-[480px]">
          {galleryImages.slice(0, 4).map((img, idx) => (
            <div
              key={idx}
              onClick={() => setActiveImage(img)}
              className={`relative cursor-pointer overflow-hidden rounded-xl bg-surface-container-highest transition-all h-28 lg:h-[114px] border ${
                activeImage === img
                  ? 'border-primary ring-1 ring-primary'
                  : 'border-white/5 opacity-80 hover:opacity-100 hover:border-white/20'
              }`}
            >
              <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
              <div className="absolute bottom-1.5 left-2 px-2 py-0.5 rounded bg-surface/85 backdrop-blur-sm text-[10px] font-mono text-on-surface-variant">
                Angle 0{idx + 1}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* 3. Main Workspace Grid: Specs (8 Cols) vs Lateral Reservation Widget (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Specifications, Overview, Amenities, Rules, Host */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Header & Meta */}
          <div className="space-y-3">
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-on-surface leading-tight">
              {studio.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant">
              <span className="flex items-center gap-1.5 text-primary font-mono font-bold">
                <Star className="w-4 h-4 fill-current" />
                <span>{studio.rating ? studio.rating.toFixed(2) : '4.95'}</span>
                <span className="text-on-surface-variant font-normal">({studio.reviewCount || 38} reviews)</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-outline" />
                <span>{displayLocation}</span>
              </span>
            </div>
          </div>

          {/* Key Metrics / Technical Specifications Matrix (4 Structural Panels) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-surface-container-low border border-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-outline flex items-center gap-1">
                <Maximize2 className="w-3 h-3 text-primary" />
                Floor Area
              </span>
              <p className="font-display font-bold text-base text-on-surface">
                {studio.sqft || 4200} <span className="text-xs text-outline font-normal">sq ft</span>
              </p>
              <p className="text-[11px] text-on-surface-variant">{studio.ceilingHeight || '18ft clearance'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container-low border border-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-outline flex items-center gap-1">
                <Zap className="w-3 h-3 text-primary" />
                Power Grid
              </span>
              <p className="font-display font-bold text-base text-on-surface">200A</p>
              <p className="text-[11px] text-on-surface-variant">Cam-Lok 3-Phase</p>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container-low border border-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-outline flex items-center gap-1">
                <VolumeX className="w-3 h-3 text-primary" />
                Acoustics
              </span>
              <p className="font-display font-bold text-base text-on-surface">NC-15</p>
              <p className="text-[11px] text-on-surface-variant">Silent Studio HVAC</p>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container-low border border-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-outline flex items-center gap-1">
                <Truck className="w-3 h-3 text-primary" />
                Load-In Access
              </span>
              <p className="font-display font-bold text-base text-on-surface">Drive-In</p>
              <p className="text-[11px] text-on-surface-variant">Ground Floor Bay</p>
            </div>
          </div>

          {/* Overview Description */}
          <div className="space-y-3 pt-2 border-t border-white/5">
            <h2 className="font-display text-lg font-bold text-on-surface">
              Space Overview
            </h2>
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
              {studio.description || studio.overview}
            </p>
          </div>

          {/* Verified Amenities & Production Gear */}
          <div className="space-y-4 pt-2 border-t border-white/5">
            <h2 className="font-display text-lg font-bold text-on-surface">
              Verified Production Amenities & Gear
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(studio.amenities || []).map((amenity: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-surface-container-low border border-white/5 text-xs text-on-surface"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Operating Rules & Code of Conduct */}
          <div className="space-y-4 pt-2 border-t border-white/5">
            <h2 className="font-display text-lg font-bold text-on-surface">
              Studio Operating Rules
            </h2>
            <div className="space-y-2">
              {(studio.rules || [
                'No glitter, smoke grenades, or pyrotechnics without prior host clearance.',
                'Shoe booties required on freshly painted cyclorama surfaces.',
                'Overtime starts promptly at 15 minutes past contracted wrap time.',
                'Grip equipment must be returned to original staging positions before wrap.',
              ]).map((rule: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-on-surface-variant">
                  <span className="font-mono text-primary font-bold">{idx + 1}.</span>
                  <span className="leading-relaxed">{rule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Host Persona Authority Card */}
          <div className="p-6 rounded-2xl bg-surface-container-low border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <img
                  src={studio.ownerPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={studio.ownerName || 'Host'}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/40"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-base text-on-surface">
                      {studio.ownerName || 'Elena Rostova'}
                    </h3>
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-mono uppercase tracking-wider font-semibold border border-primary/20">
                      PRO Host
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant font-sans">
                    {studio.ownerRole || 'Studio Director'} • {studio.memberSince || 'Member since 2022'}
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex flex-col text-right text-xs text-on-surface-variant font-mono">
                <span className="text-primary">{studio.responseTime || 'Responds in 15 mins'}</span>
                <span>100% Response Rate</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Sticky Reservation Sidebar Widget */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="rounded-3xl bg-surface-container-low border border-white/10 p-6 space-y-6 shadow-2xl shadow-black/40">
            
            {/* Price Header */}
            <div className="flex items-baseline justify-between pb-4 border-b border-white/5">
              <div>
                <span className="font-display text-3xl font-bold text-primary tabular-nums">
                  ${hourlyRate}
                </span>
                <span className="text-xs text-on-surface-variant font-mono ml-1">/ hour</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-primary font-mono font-bold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{studio.rating ? studio.rating.toFixed(2) : '4.95'}</span>
              </div>
            </div>

            {/* Quick Date & Time Selectors */}
            <div className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-outline flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  Shoot Date
                </label>
                <input
                  type="date"
                  min={tomorrow}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-container border border-white/10 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary/60 font-sans cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-outline flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    Call Time
                  </label>
                  <input
                    type="time"
                    value={selectedStart}
                    onChange={(e) => setSelectedStart(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container border border-white/10 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary/60 font-sans"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-outline flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    Wrap Time
                  </label>
                  <input
                    type="time"
                    value={selectedEnd}
                    onChange={(e) => setSelectedEnd(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container border border-white/10 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary/60 font-sans"
                  />
                </div>
              </div>

            </div>

            {/* Price Breakdown Calculation */}
            <div className="p-4 rounded-2xl bg-surface-container border border-white/5 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-on-surface-variant">
                <span>Duration</span>
                <span className="font-mono text-on-surface">
                  {totalHours > 0 ? `${totalHours.toFixed(1)} hrs` : '0 hrs'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-on-surface-variant">
                <span>Studio Rate (${hourlyRate} × {totalHours}h)</span>
                <span className="font-mono text-on-surface">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-on-surface-variant">
                <span>Damage Deposit (Refundable)</span>
                <span className="font-mono text-on-surface">${deposit.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-sm font-bold text-on-surface">
                <span>Estimated Total</span>
                <span className="font-mono text-primary text-base">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Main Booking Trigger Button */}
            <button
              onClick={() => setBookingModalOpen(true)}
              className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-primary/10 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Book Workspace Now</span>
            </button>

            {/* Guarantees & Cancellation Policy */}
            <div className="pt-2 border-t border-white/5 space-y-2 text-[11px] text-on-surface-variant font-sans">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-primary" />
                <span>Instant reservation confirmation</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span>100% Escrow Protection guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>Free cancellation up to 48 hours prior</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 4. Interactive Booking Modal Dialog */}
      <BookingModal
        studio={studio}
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialDate={selectedDate}
        initialStartTime={selectedStart}
        initialEndTime={selectedEnd}
      />

    </div>
  );
}
