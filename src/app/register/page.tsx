'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import {
  User,
  Mail,
  Image as ImageIcon,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Sparkles,
  UserPlus,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register, googleLogin } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'creator' | 'host'>('creator');
  const [submitting, setSubmitting] = useState(false);

  // Password validation rules
  const hasUppercase = useMemo(() => /[A-Z]/.test(password), [password]);
  const hasLowercase = useMemo(() => /[a-z]/.test(password), [password]);
  const hasMinLength = useMemo(() => password.length >= 6, [password]);
  const isPasswordValid = hasUppercase && hasLowercase && hasMinLength;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.error('Missing Required Fields', {
        description: 'Please fill in all required registration details.',
      });
      return;
    }

    if (!isPasswordValid) {
      toast.error('Password Requirements Not Met', {
        description: 'Must include uppercase, lowercase, and at least 6 characters.',
      });
      return;
    }

    setSubmitting(true);
    try {
      await register(name.trim(), email.trim(), photoUrl.trim(), password, role);
      toast.success('Creator Account Registered', {
        description: 'Your workstation profile has been registered. Redirecting to sign in...',
      });
      router.push('/login');
    } catch (err: any) {
      toast.error('Registration Failed', {
        description: err?.message || 'Could not complete registration. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setSubmitting(true);
    try {
      const loggedUser = await googleLogin();
      toast.success('Signed in with Google', {
        description: `Welcome ${loggedUser.name}!`,
      });
      router.push('/');
    } catch {
      toast.error('Google Sign-In failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-lg space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-[11px] uppercase tracking-wider mb-1">
            <UserPlus className="w-3 h-3" />
            <span>Join Creative Collective</span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-on-surface">
            Create Production Account
          </h1>
          <p className="font-sans text-xs text-on-surface-variant max-w-sm mx-auto">
            Book verified soundstages, access audio mixing suites, or list your private studio space.
          </p>
        </div>

        {/* Register Card Frame */}
        <div className="bg-surface-container-low border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
          {/* Account Role Selector */}
          <div className="space-y-1.5">
            <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
              Account Role
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-surface-container border border-white/5 rounded-xl">
              <button
                type="button"
                onClick={() => setRole('creator')}
                className={`py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all ${
                  role === 'creator'
                    ? 'bg-primary text-on-primary font-bold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Creator / Producer
              </button>
              <button
                type="button"
                onClick={() => setRole('host')}
                className={`py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all ${
                  role === 'host'
                    ? 'bg-primary text-on-primary font-bold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Studio Host / Owner
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="font-mono text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-primary" />
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-white/10 text-xs text-on-surface placeholder:text-outline/60 font-sans focus:outline-none focus:border-primary/60 transition-all"
              />
            </div>

            {/* Email Address */}
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
                placeholder="you@domain.com"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-white/10 text-xs text-on-surface placeholder:text-outline/60 font-sans focus:outline-none focus:border-primary/60 transition-all"
              />
            </div>

            {/* Photo URL */}
            <div className="space-y-1.5">
              <label
                htmlFor="photoUrl"
                className="font-mono text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5"
              >
                <ImageIcon className="w-3.5 h-3.5 text-primary" />
                Profile Photo URL
              </label>
              <input
                id="photoUrl"
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-white/10 text-xs text-on-surface placeholder:text-outline/60 font-sans focus:outline-none focus:border-primary/60 transition-all"
              />
            </div>

            {/* Password with Visibility Toggle */}
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

              {/* Password Validation Indicators */}
              <div className="p-3 rounded-xl bg-surface-container/70 border border-white/5 space-y-1.5 mt-2">
                <div className="text-[10px] font-mono text-outline uppercase tracking-wider">
                  Password Strength Requirements:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[11px] font-sans">
                  <div
                    className={`flex items-center gap-1.5 transition-colors ${
                      hasUppercase ? 'text-emerald-400' : 'text-outline'
                    }`}
                  >
                    {hasUppercase ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <XCircle className="w-3 h-3 text-outline" />
                    )}
                    <span>1 Uppercase (A-Z)</span>
                  </div>

                  <div
                    className={`flex items-center gap-1.5 transition-colors ${
                      hasLowercase ? 'text-emerald-400' : 'text-outline'
                    }`}
                  >
                    {hasLowercase ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <XCircle className="w-3 h-3 text-outline" />
                    )}
                    <span>1 Lowercase (a-z)</span>
                  </div>

                  <div
                    className={`flex items-center gap-1.5 transition-colors ${
                      hasMinLength ? 'text-emerald-400' : 'text-outline'
                    }`}
                  >
                    {hasMinLength ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <XCircle className="w-3 h-3 text-outline" />
                    )}
                    <span>Min 6 characters</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || !isPasswordValid}
              className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-display text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-primary/10 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <UserPlus className="w-4 h-4" />
              <span>{submitting ? 'Registering Account...' : 'Complete Registration'}</span>
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
            <span>Sign Up with Google</span>
          </button>

          {/* Login Navigation Link */}
          <div className="pt-2 text-center text-xs text-outline font-sans">
            <span>Already have a workstation account?</span>{' '}
            <Link
              href="/login"
              className="text-primary hover:underline font-semibold ml-1 inline-flex items-center gap-1"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Security Assurance Footer */}
        <div className="text-center flex items-center justify-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-outline">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>Strict Privacy • Encrypted Credentials • No Data Brokering</span>
        </div>
      </div>
    </div>
  );
}
