'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { IStudio } from '@/types';
import { MapPin, Users, Heart, ArrowRight, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { fetcher } from '@/lib/api';
import { toast } from 'sonner';

interface StudioCardProps {
  studio: IStudio;
  initialWishlisted?: boolean;
  onWishlistToggle?: (studioId: string, isSaved: boolean) => void;
}

export function StudioCard({ studio, initialWishlisted = false, onWishlistToggle }: StudioCardProps) {
  const { user } = useAuth();
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  // Flexible normalization for schema compatibility
  const displayImage =
    studio.imageUrl ||
    ((studio as any).images && (studio as any).images[0]) ||
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1000&q=80';

  const rate = studio.hourlyRate || (studio as any).pricePerHour || 95;
  const reviews = studio.reviewCount ?? (studio as any).reviewsCount ?? 0;
  const capacity = studio.maxCapacity || (studio as any).capacity || 15;

  const displayLocation =
    typeof studio.location === 'string'
      ? studio.location
      : `${studio.location?.city || ''}${studio.location?.state ? `, ${studio.location.state}` : ''}`;

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.info('Please sign in to save studios to your personal wishlist.');
      return;
    }

    try {
      setLoadingWishlist(true);
      const res = await fetcher<{ success: boolean; saved: boolean; message: string }>('/wishlists/toggle', {
        method: 'POST',
        body: JSON.stringify({ studioId: studio._id }),
      });
      setWishlisted(res.saved);
      toast.success(res.message);
      if (onWishlistToggle) {
        onWishlistToggle(studio._id, res.saved);
      }
    } catch {
      toast.error('Failed to update wishlist.');
    } finally {
      setLoadingWishlist(false);
    }
  };

  return (
    <article className="group flex flex-col h-full rounded-2xl bg-surface-container-low border border-white/10 hover:border-primary/40 transition-all duration-300 overflow-hidden shadow-lg shadow-black/20 hover:shadow-2xl hover:shadow-primary/5">
      
      {/* Studio Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-container-highest">
        <img
          src={displayImage}
          alt={studio.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80" />

        {/* Top Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-0.5 text-[11px] font-mono tracking-wider uppercase rounded-full bg-surface/85 text-primary border border-white/10 backdrop-blur-md">
            {studio.category}
          </span>
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlistClick}
          disabled={loadingWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
            wishlisted
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-surface/80 text-on-surface-variant hover:text-rose-400 hover:bg-surface border border-white/10'
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Hourly Rate Overlay */}
        <div className="absolute bottom-3 left-3 flex items-baseline gap-1 text-on-surface">
          <span className="font-display text-xl font-bold tracking-tight text-primary tabular-nums">
            ${rate}
          </span>
          <span className="text-xs text-on-surface-variant font-mono">/ hr</span>
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface/85 backdrop-blur-md border border-white/10 text-xs font-mono text-primary">
          <Star className="w-3 h-3 fill-current" />
          <span className="font-bold">{studio.rating ? studio.rating.toFixed(2) : '5.00'}</span>
          <span className="text-on-surface-variant text-[10px]">({reviews})</span>
        </div>
      </div>

      {/* Studio Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-2">
          
          {/* Studio Title */}
          <Link href={`/studios/${studio._id}`} className="block">
            <h3 className="font-display font-bold text-base text-on-surface group-hover:text-primary transition-colors line-clamp-1 leading-snug">
              {studio.title}
            </h3>
          </Link>

          {/* Location & Capacity */}
          <div className="flex items-center gap-3 text-xs text-on-surface-variant">
            <span className="flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 text-outline flex-shrink-0" />
              <span className="truncate">{displayLocation}</span>
            </span>
            <span className="text-outline/40">•</span>
            <span className="flex items-center gap-1 shrink-0">
              <Users className="w-3.5 h-3.5 text-outline" />
              <span>Up to {capacity}</span>
            </span>
          </div>

          {/* Amenities Pills */}
          {studio.amenities && studio.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {studio.amenities.slice(0, 3).map((amenity, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-surface-container border border-white/5 text-[10px] font-mono text-on-surface-variant truncate max-w-[130px]"
                >
                  {amenity}
                </span>
              ))}
              {studio.amenities.length > 3 && (
                <span className="px-1.5 py-0.5 rounded bg-surface-container border border-white/5 text-[10px] font-mono text-outline">
                  +{studio.amenities.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Card Footer Strip with CTA */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs font-mono text-outline">
            Instant Confirmation
          </span>
          <Link
            href={`/studios/${studio._id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high border border-white/10 text-xs font-medium text-on-surface group-hover:bg-primary group-hover:text-on-primary group-hover:border-primary transition-all shadow-sm"
          >
            <span>View Space</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </article>
  );
}
