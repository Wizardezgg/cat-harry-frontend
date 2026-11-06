'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { fetcher } from '@/lib/api';
import { toast } from 'sonner';
import {
  Building2,
  DollarSign,
  Users,
  MapPin,
  Image as ImageIcon,
  FileText,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Check,
  CheckCircle2,
} from 'lucide-react';

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

function AddStudioForm() {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [hourlyRate, setHourlyRate] = useState<number | ''>('');
  const [securityDeposit, setSecurityDeposit] = useState<number | ''>('');
  const [maxCapacity, setMaxCapacity] = useState<number | ''>('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [overview, setOverview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Studio title is required');
      return;
    }

    if (!category) {
      toast.error('Please select a creative discipline category');
      return;
    }

    if (!hourlyRate || Number(hourlyRate) <= 0) {
      toast.error('Please specify a valid hourly rate');
      return;
    }

    if (!address.trim() || !city.trim()) {
      toast.error('Studio address and city are required');
      return;
    }

    if (!imageUrl.trim()) {
      toast.error('Please provide or select a studio cover photo');
      return;
    }

    if (!overview.trim()) {
      toast.error('Detailed workspace overview is required');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        category,
        hourlyRate: Number(hourlyRate),
        securityDeposit: Number(securityDeposit) || 0,
        maxCapacity: Number(maxCapacity) || 10,
        location: {
          address: address.trim(),
          city: city.trim(),
        },
        imageUrl: imageUrl.trim(),
        gallery: [imageUrl.trim()],
        amenities: selectedAmenities,
        overview: overview.trim(),
        ownerId: user?._id || user?.email || 'host_user',
        ownerName: user?.name || 'Verified Host',
        ownerEmail: (user?.email || '').toLowerCase(),
      };

      await fetcher('/studios', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      toast.success('Studio Published Successfully!', {
        description: `${title} is now active on the Aperture network.`,
      });
      router.push('/my-listings');
    } catch (err: any) {
      toast.error('Failed to Publish Studio', {
        description: err?.message || 'Could not save studio to network.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-surface px-6 lg:px-12 py-10 max-w-4xl mx-auto space-y-8 text-on-surface">
      
      {/* Top Header & Quick Test Button */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-outline uppercase tracking-wider mb-2">
            <span>Aperture</span>
            <span>/</span>
            <span className="text-primary">Host Onboarding</span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-on-surface">
            List a Creative Workspace
          </h1>
          <p className="text-sm text-on-surface-variant font-sans mt-1">
            Publish your photo cyc wall, soundstage, audio suite, or atelier for peer-to-peer booking
          </p>
        </div>
      </div>

      {/* Main Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Studio Classification */}
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-low border border-white/10 space-y-6 shadow-xl shadow-black/20">
          <div className="flex items-center gap-2.5 pb-4 border-b border-white/5">
            <Building2 className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-bold text-on-surface">
              1. Studio Identification & Category
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-mono uppercase text-outline">
                Studio Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Apex 40ft Pre-Lit White Cyclorama & Soundstage"
                required
                className="w-full px-4 py-3 bg-surface-container border border-white/10 rounded-xl text-xs text-on-surface placeholder:text-outline/60 focus:outline-none focus:border-primary/60 font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-outline">
                Creative Discipline Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-4 py-3 bg-surface-container border border-white/10 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary/60 font-sans cursor-pointer"
              >
                <option value="" disabled>Select Creative Discipline Category...</option>
                <option value="Photo Studio">Photo Studio</option>
                <option value="Film Soundstage">Film Soundstage</option>
                <option value="Recording & Podcast Suite">Recording & Podcast Suite</option>
                <option value="Dance & Rehearsal Hall">Dance & Rehearsal Hall</option>
                <option value="Art & Ceramic Atelier">Art & Ceramic Atelier</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-outline flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-primary" />
                Maximum Crew Capacity *
              </label>
              <input
                type="number"
                min="1"
                max="250"
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(Number(e.target.value))}
                required
                className="w-full px-4 py-3 bg-surface-container border border-white/10 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary/60 font-sans"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Pricing & Escrow Terms */}
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-low border border-white/10 space-y-6 shadow-xl shadow-black/20">
          <div className="flex items-center gap-2.5 pb-4 border-b border-white/5">
            <DollarSign className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-bold text-on-surface">
              2. Commercial Pricing & Security Deposit
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-outline">
                Hourly Production Rate (USD) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-xs font-mono text-primary">$</span>
                <input
                  type="number"
                  min="25"
                  max="2000"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="145"
                  required
                  className="w-full pl-8 pr-4 py-3 bg-surface-container border border-white/10 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary/60 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-outline">
                Refundable Damage Deposit (USD) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-xs font-mono text-primary">$</span>
                <input
                  type="number"
                  min="0"
                  max="5000"
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="200"
                  required
                  className="w-full pl-8 pr-4 py-3 bg-surface-container border border-white/10 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary/60 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Geolocation & Metro Envelope */}
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-low border border-white/10 space-y-6 shadow-xl shadow-black/20">
          <div className="flex items-center gap-2.5 pb-4 border-b border-white/5">
            <MapPin className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-bold text-on-surface">
              3. Studio Location & Access
            </h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-outline">
                Physical Street Address *
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 77, Shamoli"
                required
                className="w-full px-4 py-3 bg-surface-container border border-white/10 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary/60 font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-outline">
                City / Metro *
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Dhaka"
                required
                className="w-full px-4 py-3 bg-surface-container border border-white/10 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary/60 font-sans"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Imagery & Preset Selector */}
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-low border border-white/10 space-y-6 shadow-xl shadow-black/20">
          <div className="flex items-center gap-2.5 pb-4 border-b border-white/5">
            <ImageIcon className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-bold text-on-surface">
              4. Studio Cover Imagery
            </h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-outline">
                Image URL *
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                required
                className="w-full px-4 py-3 bg-surface-container border border-white/10 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary/60 font-sans"
              />
            </div>

            {/* Quick Preset Selector */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-outline block">
                Or pick a curated studio preset image:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {presetImages.map((p) => (
                  <div
                    key={p.name}
                    onClick={() => setImageUrl(p.url)}
                    className={`cursor-pointer rounded-xl overflow-hidden border p-1 transition-all ${
                      imageUrl === p.url
                        ? 'border-primary ring-1 ring-primary bg-primary/10'
                        : 'border-white/10 hover:border-white/30 bg-surface-container'
                    }`}
                  >
                    <div className="aspect-[16/10] w-full rounded-lg overflow-hidden bg-surface-container-high mb-1.5">
                      <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[10px] font-mono text-on-surface text-center truncate px-1">
                      {p.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Verified Amenities Checklist */}
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-low border border-white/10 space-y-6 shadow-xl shadow-black/20">
          <div className="flex items-center gap-2.5 pb-4 border-b border-white/5">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-bold text-on-surface">
              5. Production Amenities & Technical Infrastructure
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {availableAmenities.map((amenity) => {
              const checked = selectedAmenities.includes(amenity);
              return (
                <div
                  key={amenity}
                  onClick={() => toggleAmenity(amenity)}
                  className={`cursor-pointer p-3 rounded-xl border text-xs flex items-center justify-between transition-all select-none ${
                    checked
                      ? 'bg-surface-container border-primary text-on-surface'
                      : 'bg-surface-container-low border-white/5 text-on-surface-variant hover:border-white/20'
                  }`}
                >
                  <span className="pr-2">{amenity}</span>
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      checked ? 'bg-primary border-primary text-on-primary' : 'border-white/20'
                    }`}
                  >
                    {checked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 6: Overview & Read-only Host Identity */}
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-low border border-white/10 space-y-6 shadow-xl shadow-black/20">
          <div className="flex items-center gap-2.5 pb-4 border-b border-white/5">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-bold text-on-surface">
              6. Detailed Overview & Host Verification
            </h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-outline">
                Workspace Description & Acoustic Notes *
              </label>
              <textarea
                rows={4}
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                placeholder="Describe lighting grid height, sound insulation, access elevators, parking bays, and amenities..."
                required
                className="w-full px-4 py-3 bg-surface-container border border-white/10 rounded-xl text-xs text-on-surface placeholder:text-outline/60 focus:outline-none focus:border-primary/60 font-sans resize-none"
              />
            </div>

            {/* Read-Only Host Information (Assignment Requirement) */}
            <div className="pt-4 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-surface-container border border-white/5 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-outline block">
                  Host Name (Read-Only)
                </span>
                <p className="text-xs font-bold text-on-surface">
                  {user?.name || 'Verified Host'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container border border-white/5 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-outline block">
                  Host Contact Email (Read-Only)
                </span>
                <p className="text-xs font-mono text-primary truncate">
                  {user?.email || 'Sign in to publish'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-xl bg-surface-container border border-white/10 text-xs font-semibold text-on-surface hover:bg-surface-container-high transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold uppercase tracking-wider transition-all shadow-xl shadow-primary/10 active:scale-[0.98] disabled:opacity-50 flex items-center gap-2"
          >
            {submitting ? (
              <span>Publishing Studio...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Publish Studio Listing</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}

export default function AddStudioPage() {
  return (
    <ProtectedRoute>
      <AddStudioForm />
    </ProtectedRoute>
  );
}
