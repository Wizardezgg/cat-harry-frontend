'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { StudioCard } from '@/components/studios/StudioCard';
import { StudioGridSkeleton } from '@/components/studios/StudioSkeleton';
import { IStudio } from '@/types';
import { fetcher } from '@/lib/api';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';

function WishlistContent() {
  const { user } = useAuth();
  const [studios, setStudios] = useState<IStudio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlist() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const query = user._id ? `?userId=${user._id}` : `?userEmail=${encodeURIComponent(user.email || '')}`;
        const res = await fetcher<{ success: boolean; studios: IStudio[] }>(`/wishlist${query}`);
        if (res.success && res.studios) {
          setStudios(res.studios);
        } else {
          setStudios([]);
        }
      } catch {
        setStudios([]);
      } finally {
        setLoading(false);
      }
    }

    loadWishlist();
  }, [user]);

  const handleWishlistToggle = (studioId: string, isSaved: boolean) => {
    if (!isSaved) {
      setStudios((prev) => prev.filter((s) => s._id !== studioId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 sm:py-14 space-y-8">
      {/* 1. Header Bar */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-on-surface-variant font-mono text-xs uppercase tracking-widest">
            <span>Creative Portal</span>
            <span className="opacity-40">/</span>
            <span className="text-primary font-semibold">Saved Workspaces</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-on-surface">
            My Wishlist ({studios.length})
          </h1>
          <p className="font-sans text-xs sm:text-sm text-on-surface-variant max-w-2xl leading-relaxed">
            Curated creative spaces, daylight soundstages, and acoustic podcast suites bookmarked for your productions.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            href="/studios"
            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-display text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-primary/10 active:scale-95"
          >
            <span>Explore More Studios</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 2. Grid or Empty State */}
      {loading ? (
        <StudioGridSkeleton count={3} />
      ) : studios.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studios.map((studio) => (
            <StudioCard
              key={studio._id}
              studio={studio}
              initialWishlisted={true}
              onWishlistToggle={handleWishlistToggle}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-3xl bg-surface-container-low border border-dashed border-white/10 flex flex-col items-center justify-center p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-surface-container-high border border-white/10 flex items-center justify-center text-outline">
            <Heart className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-semibold text-lg text-on-surface">
              Your Wishlist is Empty
            </h3>
            <p className="text-xs text-on-surface-variant max-w-sm">
              Click the heart icon on any creative studio to bookmark it here for fast booking access.
            </p>
          </div>
          <Link
            href="/studios"
            className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-xs hover:bg-primary-container transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Discover Creative Studios</span>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function WishlistPage() {
  return (
    <ProtectedRoute>
      <WishlistContent />
    </ProtectedRoute>
  );
}
