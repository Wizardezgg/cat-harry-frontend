import React from 'react';

export function StudioSkeleton() {
  return (
    <div className="rounded-2xl bg-surface-container-low border border-white/5 overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-[16/10] w-full bg-surface-container-high" />
      
      {/* Content Body Skeleton */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-3 bg-surface-container-high rounded w-24" />
          <div className="h-3 bg-surface-container-high rounded w-12" />
        </div>
        <div className="h-4 bg-surface-container-high rounded w-3/4" />
        <div className="space-y-1.5 pt-1">
          <div className="h-3 bg-surface-container-high rounded w-full" />
          <div className="h-3 bg-surface-container-high rounded w-2/3" />
        </div>
        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
          <div className="h-3 bg-surface-container-high rounded w-20" />
          <div className="h-7 bg-surface-container-high rounded-lg w-24" />
        </div>
      </div>
    </div>
  );
}

export function StudioGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <StudioSkeleton key={i} />
      ))}
    </div>
  );
}
