'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect if authentication verification has fully resolved and user is absent
    if (!loading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-on-surface">
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-surface-container-low border border-white/10 text-xs font-mono text-primary shadow-xl">
          <Loader2 className="w-4 h-4 text-primary animate-spin" />
          <span>VERIFYING CREATOR CREDENTIALS...</span>
        </div>
        <p className="text-xs text-on-surface-variant font-mono mt-3">
          Restoring session with HTTPOnly security
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
