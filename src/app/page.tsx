'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { HeroSlider } from '@/components/home/HeroSlider';
import { StudioCard } from '@/components/studios/StudioCard';
import { StudioGridSkeleton } from '@/components/studios/StudioSkeleton';
import { IStudio } from '@/types';
import { fetcher } from '@/lib/api';
import {
  Camera,
  Video,
  Mic,
  Disc3,
  Palette,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Headphones,
} from 'lucide-react';

const categories = [
  {
    name: 'Photo Studio',
    title: 'Photo Studios',
    desc: 'Daylight cyc walls, corner lofts & high-speed strobe grids',
    icon: Camera,
    param: 'Photo Studio',
  },
  {
    name: 'Film Soundstage',
    title: 'Film Stages',
    desc: 'NC-25 soundproofed cinema stages & 3-phase camlock power',
    icon: Video,
    param: 'Film Soundstage',
  },
  {
    name: 'Recording & Podcast Suite',
    title: 'Audio & Podcast',
    desc: 'Tuned Dolby Atmos control rooms & Shure SM7B broadcast audio',
    icon: Mic,
    param: 'Recording & Podcast Suite',
  },
  {
    name: 'Dance & Rehearsal Hall',
    title: 'Movement Halls',
    desc: 'Sprung Harlequin hardwood floors & 30ft mirror walls',
    icon: Disc3,
    param: 'Dance & Rehearsal Hall',
  },
  {
    name: 'Art & Ceramic Atelier',
    title: 'Art Ateliers',
    desc: 'Electric pottery wheels, clay slab rollers & natural light',
    icon: Palette,
    param: 'Art & Ceramic Atelier',
  },
];



const workflowSteps = [
  {
    num: '01',
    title: 'Discover Spaces',
    desc: 'Filter studios by acoustic rating, power capacity, ceiling height, or geographic metro.',
  },
  {
    num: '02',
    title: 'Select Shoot Hours',
    desc: 'Choose exact production dates and hourly time slots with real-time double-booking verification.',
  },
  {
    num: '03',
    title: 'Book Instantly',
    desc: 'Confirm reservations with transparent hourly rates, refundable deposit, and instant invoice.',
  },
  {
    num: '04',
    title: 'Create & Produce',
    desc: 'Arrive at the studio with confirmed digital access codes and verified host technical assistance.',
  },
];

const assurances = [
  {
    icon: ShieldCheck,
    title: '$1,000,000 Liability Assurance',
    desc: 'Every production reservation is backed by comprehensive property damage and host liability protection.',
  },
  {
    icon: CheckCircle2,
    title: 'Acoustically Verified Spaces',
    desc: 'All soundstages and audio suites undergo decibel isolation testing and electrical load audits.',
  },
  {
    icon: Clock,
    title: 'Transparent Production Billing',
    desc: 'Clear hourly pricing with zero surprise overtime fees and immediate digital PDF booking receipts.',
  },
  {
    icon: Headphones,
    title: '24/7 Production Concierge',
    desc: 'Dedicated production support on standby for gear emergencies, lockouts, or shoot schedule extensions.',
  },
];

export default function HomePage() {
  const [featuredStudios, setFeaturedStudios] = useState<IStudio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await fetcher<{ success: boolean; studios: IStudio[] }>('/studios/featured');
        if (res.success && res.studios) {
          setFeaturedStudios(res.studios);
        } else {
          setFeaturedStudios([]);
        }
      } catch (err) {
        setFeaturedStudios([]);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  return (
    <div className="space-y-20 pb-24">
      
      {/* 1. Split Hero with Integrated Search & Rotating Showcase Card */}
      <HeroSlider />

      {/* 2. Browse Studio Categories Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-primary font-semibold">
              Discover by Discipline
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-on-surface mt-1">
              Browse Studio Categories
            </h2>
            <p className="text-xs text-on-surface-variant font-sans mt-1">
              Purpose-built environments curated for specialized creative media
            </p>
          </div>
          <Link
            href="/studios"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline underline-offset-4"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/studios?category=${encodeURIComponent(cat.param)}`}
                className="group p-5 rounded-2xl bg-surface-container-low border border-white/10 hover:border-primary/40 transition-all shadow-sm flex flex-col justify-between hover:bg-surface-container hover:shadow-xl hover:shadow-primary/5"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-surface-container-high border border-white/10 flex items-center justify-center text-primary mb-4 group-hover:scale-105 group-hover:border-primary/40 group-hover:bg-primary group-hover:text-on-primary transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-semibold text-sm text-on-surface group-hover:text-primary transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed font-sans">
                    {cat.desc}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-outline group-hover:text-primary transition-colors">
                  <span>Explore Spaces</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Studios Section (Dynamic from backend with graceful fallback) */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-primary font-semibold">
              Top-Rated Workspaces
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-on-surface mt-1">
              Featured Studios
            </h2>
            <p className="text-xs text-on-surface-variant font-sans mt-1">
              Handpicked soundstages and lofts with verified technical packages
            </p>
          </div>
          <Link
            href="/studios"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 hover:border-primary/40 text-xs font-semibold text-on-surface bg-surface-container-low hover:text-primary transition-all shadow-sm"
          >
            <span>Explore All Workspaces</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <StudioGridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredStudios.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Extra Section 1: How Booking Works (4-Step Production Workflow) */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="rounded-3xl bg-surface-container-low border border-white/10 p-8 sm:p-12 shadow-xl shadow-black/20">
          <div className="max-w-2xl mb-10">
            <span className="text-[11px] font-mono uppercase tracking-widest text-primary font-semibold">
              Seamless Reservation Lifecycle
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-on-surface mt-1">
              How Booking Works
            </h2>
            <p className="text-xs text-on-surface-variant font-sans mt-1">
              From scouting technical specs to wrapping on-set production
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((step) => (
              <div
                key={step.num}
                className="p-5 rounded-2xl bg-surface-container border border-white/5 space-y-3 hover:border-white/20 transition-all"
              >
                <div className="text-xs font-mono font-bold text-primary">
                  {step.num}
                </div>
                <h3 className="font-display font-semibold text-sm text-on-surface">
                  {step.title}
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed font-sans">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Extra Section 2: Host Guarantee & Creator Support */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="border-t border-white/10 pt-14">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[11px] font-mono uppercase tracking-widest text-primary font-semibold">
              Trust & Safety Standards
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-on-surface mt-1">
              Host Guarantee & Creator Support
            </h2>
            <p className="text-xs text-on-surface-variant font-sans mt-1">
              Industry-standard protection for every creator and studio owner on the network
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {assurances.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-surface-container-low border border-white/10 space-y-3 hover:border-primary/40 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-surface-container-high border border-white/10 flex items-center justify-center text-primary group-hover:scale-105 group-hover:bg-primary group-hover:text-on-primary transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-semibold text-sm text-on-surface group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
