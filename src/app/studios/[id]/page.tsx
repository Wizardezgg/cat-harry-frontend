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
  ArrowLeft,
  Sparkles,
  Phone,
  Mail,
  CheckCircle2,
} from 'lucide-react';



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

  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  useEffect(() => {
    async function loadStudio() {
      try {
        const res = await fetcher<{ success: boolean; studio: IStudio }>(`/studios/${studioId}`);
        if (res.success && res.studio) {
          setStudio(res.studio);
          setActiveImage(res.studio.imageUrl || (res.studio as any).images?.[0] || '');
        } else {
          setStudio(null);
        }
      } catch {
        setStudio(null);
      } finally {
        setLoading(false);
      }
    }
    loadStudio();
  }, [studioId]);

  const hourlyRate = studio?.hourlyRate || studio?.pricePerHour || 95;
  const deposit = studio?.securityDeposit || 150;

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
      const res = await fetcher<{ success: boolean; saved?: boolean; isSaved?: boolean; message: string }>('/wishlist/toggle', {
        method: 'POST',
        body: JSON.stringify({
          studioId: studio._id,
          userId: user._id || user.email,
          userEmail: user.email,
        }),
      });
      const isNowSaved = res.saved ?? res.isSaved ?? !wishlisted;
      setWishlisted(isNowSaved);
      toast.success(res.message);
    } catch {
      setWishlisted(!wishlisted);
      toast.success(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist');
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-surface px-6 lg:px-12 py-12 max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="h-4 bg-surface-container-high rounded w-48" />
        <div className="h-8 bg-surface-container-high rounded w-96" />
        <div className="h-[460px] bg-surface-container-high rounded-2xl w-full" />
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-20 space-y-4 text-on-surface">
        <h2 className="text-2xl font-bold font-display">Studio Not Found</h2>
        <p className="text-sm text-on-surface-variant max-w-md">
          This workspace listing could not be found or has been removed from the platform catalog.
        </p>
        <Link
          href="/studios"
          className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs uppercase tracking-wider hover:bg-primary-container transition-all"
        >
          Explore All Studios
        </Link>
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

          <div className="absolute bottom-4 right-4 flex items-center text-xs font-mono">
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
                <span>
                  {studio.reviewCount && studio.reviewCount > 0 && studio.rating
                    ? studio.rating.toFixed(2)
                    : studio.reviewsCount && studio.reviewsCount > 0 && studio.rating
                    ? studio.rating.toFixed(2)
                    : '0.00'}
                </span>
                <span className="text-on-surface-variant font-normal">
                  ({studio.reviewCount || studio.reviewsCount || 0} reviews)
                </span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-outline" />
                <span>{displayLocation}</span>
              </span>
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
              {(studio.rules && studio.rules.length > 0
                ? studio.rules
                : [
                    'Standard professional studio conduct and respectful gear handling required.',
                    'Overtime starts promptly at 15 minutes past contracted wrap time.',
                    'Stage must be left clean and ready for subsequent production crews.',
                  ]
              ).map((rule: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-on-surface-variant">
                  <span className="font-mono text-primary font-bold">{idx + 1}.</span>
                  <span className="leading-relaxed">{rule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Host Authority Card */}
          <div className="p-6 rounded-2xl bg-surface-container-low border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-on-surface">
                  {studio.ownerName || 'Verified Host'}
                </h3>
                <p className="text-xs text-on-surface-variant font-sans">
                  {studio.ownerRole || 'Studio Host'}
                </p>
              </div>
              <div className="hidden sm:flex flex-col text-right text-xs text-on-surface-variant font-mono">
                <span className="text-primary">{studio.responseTime || 'Verified Host'}</span>
                <span>Production Workspace</span>
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
                <span>
                  {studio.reviewCount && studio.reviewCount > 0 && studio.rating
                    ? studio.rating.toFixed(2)
                    : studio.reviewsCount && studio.reviewsCount > 0 && studio.rating
                    ? studio.rating.toFixed(2)
                    : '0.00'}
                </span>
              </div>
            </div>

            {/* Reservation Highlights */}
            <div className="p-4 rounded-2xl bg-surface-container border border-white/5 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span>Security Deposit</span>
                <span className="font-mono text-on-surface">${deposit.toFixed(2)} (Refundable)</span>
              </div>
              <div className="flex items-center justify-between text-on-surface-variant">
                <span>Booking Model</span>
                <span className="font-mono text-emerald-400 font-semibold">Instant Lock Active</span>
              </div>
            </div>

            {/* Main Booking Trigger Button */}
            <button
              onClick={() => setBookingModalOpen(true)}
              className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-primary/10 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Reserve Workspace</span>
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
        initialDate={tomorrow}
        initialStartTime="10:00"
        initialEndTime="14:00"
      />

    </div>
  );
}
