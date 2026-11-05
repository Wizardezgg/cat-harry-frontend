'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  LogIn,
} from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const { login, googleLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Missing Credentials', {
        description: 'Please provide both your registered email and password.',
      });
      return;
    }

    setSubmitting(true);
    try {
      const loggedUser = await login(email, password);
      toast.success('Welcome back to Aperture', {
        description: `Signed in as ${loggedUser.name} (${loggedUser.role.toUpperCase()}).`,
      });
      router.push(redirectUrl);
    } catch (err: any) {
      toast.error('Authentication Error', {
        description: err?.message || 'Invalid email or password credentials.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // 1-Click Fast Fill for Examiner
  const handleQuickLogin = async (role: 'host' | 'creator') => {
    setSubmitting(true);
    const targetEmail = role === 'host' ? 'host@studiospace.com' : 'creator@studiospace.com';
    const targetPass = role === 'host' ? 'Host@1234' : 'Creator@1234';

    setEmail(targetEmail);
    setPassword(targetPass);

    try {
      const loggedUser = await login(targetEmail, targetPass);
      toast.success('Examiner Fast Sign-In Successful', {
        description: `Logged in as ${loggedUser.name} [${role.toUpperCase()}]. Redirecting...`,
      });
      router.push(redirectUrl);
    } catch {
      toast.error('Quick login failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Google Sign-In
  const handleGoogleLogin = async () => {
    setSubmitting(true);
    try {
      const loggedUser = await googleLogin();
      toast.success('Google Authentication Successful', {
        description: `Signed in as ${loggedUser.name}.`,
      });
      router.push(redirectUrl);
    } catch {
      toast.error('Google Sign-In failed');
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-[11px] uppercase tracking-wider mb-1">
            <Lock className="w-3 h-3" />
            <span>Secure Production Portal</span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-on-surface">
            Sign In to Aperture
          </h1>
          <p className="font-sans text-xs text-on-surface-variant max-w-xs mx-auto">
            Access verified soundstages, production suites, and host management commands.
          </p>
        </div>

        {/* 1-Click Examiner Quick Fill Banner */}
        <div className="p-4 rounded-2xl bg-surface-container-low border border-primary/20 space-y-2.5 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-primary uppercase tracking-widest font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Examiner Quick Access
            </span>
            <span className="text-[10px] font-mono text-outline">1-Click Auth</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('host')}
              disabled={submitting}
              className="py-2 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high border border-white/10 text-left transition-all group"
            >
              <div className="font-display text-xs font-semibold text-on-surface group-hover:text-primary flex items-center gap-1">
                <span>👑 Host Account</span>
              </div>
              <div className="font-mono text-[10px] text-outline truncate">
                host@studiospace.com
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('creator')}
              disabled={submitting}
              className="py-2 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high border border-white/10 text-left transition-all group"
            >
              <div className="font-display text-xs font-semibold text-on-surface group-hover:text-primary flex items-center gap-1">
                <span>🎬 Creator Account</span>
              </div>
              <div className="font-mono text-[10px] text-outline truncate">
                creator@studiospace.com
              </div>
            </button>
          </div>
        </div>

        {/* Login Card Frame */}
        <div className="bg-surface-container-low border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="font-mono text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-primary" />
                Workstation Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@cinema-collective.com"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-white/10 text-xs text-on-surface placeholder:text-outline/60 font-sans focus:outline-none focus:border-primary/60 transition-all"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="font-mono text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-primary" />
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-surface-container border border-white/10 text-xs text-on-surface placeholder:text-outline/60 font-sans focus:outline-none focus:border-primary/60 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-surface-container border-white/20 text-primary focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <label htmlFor="remember" className="font-sans text-xs text-on-surface-variant cursor-pointer select-none">
                Remember workstation session
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-display text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-primary/10 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{submitting ? 'Verifying Session...' : 'Sign In to Workspace'}</span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-white/5" />
            <span className="relative px-3 bg-surface-container-low font-mono text-[10px] uppercase tracking-widest text-outline">
              or continue with
            </span>
          </div>

          {/* Social Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={submitting}
            className="w-full py-2.5 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high border border-white/10 text-xs font-sans text-on-surface font-medium transition-all flex items-center justify-center gap-2.5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Registration Navigation Link */}
          <div className="pt-2 text-center text-xs text-outline font-sans">
            <span>New creator on the platform?</span>{' '}
            <Link
              href="/register"
              className="text-primary hover:underline font-semibold ml-1 inline-flex items-center gap-1"
            >
              <span>Create Account</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Security Assurance Footer */}
        <div className="text-center flex items-center justify-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-outline">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>HTTPOnly Token Security • 256-Bit SSL Protection</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center text-xs font-mono text-primary">
          INITIALIZING WORKSTATION...
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
