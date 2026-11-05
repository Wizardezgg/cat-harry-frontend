import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Compass,
  ArrowRight,
  Sparkles,
  Users,
  Video,
  Award,
  CheckCircle2,
  Lock,
} from 'lucide-react';

const stats = [
  { label: 'Verified Studios & Stages', value: '140+' },
  { label: 'Creative Hub Metros', value: '12' },
  { label: 'Escrow Volume Protected', value: '$1.8M+' },
  { label: 'Average Production Rating', value: '4.95 ★' },
];

const values = [
  {
    title: 'Zero Broker Intermediaries',
    desc: 'Legacy studio rentals force creators through opaque location agents with 35% markups. Aperture enables direct, friction-free booking between creative peers.',
  },
  {
    title: 'Precision Technical Auditing',
    desc: 'Every soundstage, daylight loft, and audio control room lists real, measured technical specifications: 3-phase camlock amperage, STC decibel ratings, and clear truss heights.',
  },
  {
    title: 'Uncompromised Escrow Safety',
    desc: 'Production schedules are volatile. Our escrow framework protects creator deposits with 48-hour free cancellation, while safeguarding hosts against non-payment or property damage.',
  },
];

export default function AboutUsPage() {
  return (
    <div className="space-y-24 py-12 sm:py-16">
      {/* 1. Header Mission */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 text-center space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-[11px] uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-primary" />
          <span>Our Mission & Vision</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-on-surface max-w-4xl mx-auto leading-[1.1]">
          Democratizing Access to <span className="text-primary">World-Class Soundstages</span>
        </h1>

        <p className="font-sans text-sm sm:text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
          Aperture was founded by filmmakers and studio operators to bridge the divide between independent creators and private, high-caliber creative workspaces.
        </p>

        {/* Global Impact Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8">
          {stats.map((s) => (
            <div
              key={s.label}
              className="p-5 rounded-2xl bg-surface-container-low border border-white/5 space-y-1 text-center"
            >
              <div className="font-display text-2xl sm:text-3xl font-bold text-primary">
                {s.value}
              </div>
              <div className="font-mono text-[11px] uppercase tracking-wider text-outline">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Platform Core Values */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="font-mono text-xs text-primary uppercase tracking-widest font-semibold">
            Our Core Principles
          </span>
          <h2 className="font-display text-3xl font-bold text-on-surface">
            Built by Creators, for Creators
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v, idx) => (
            <div
              key={v.title}
              className="p-6 sm:p-8 rounded-2xl bg-surface-container-low border border-white/5 space-y-4 hover:border-primary/40 transition-all group"
            >
              <span className="font-mono text-xs text-primary font-bold px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                0{idx + 1}
              </span>
              <h3 className="font-display text-xl font-bold text-on-surface group-hover:text-primary transition-colors">
                {v.title}
              </h3>
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Collective Call to Action */}
      <section className="max-w-5xl mx-auto px-6 lg:px-12">
        <div className="rounded-3xl bg-surface-container-low border border-white/10 p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <span className="font-mono text-xs uppercase tracking-widest text-primary font-semibold">
            Join the Creative Exchange
          </span>

          <h2 className="font-display text-3xl sm:text-4xl font-bold text-on-surface tracking-tight">
            Ready to Produce Your Next Vision?
          </h2>

          <p className="font-sans text-xs sm:text-sm text-on-surface-variant max-w-xl mx-auto leading-relaxed">
            Discover verified daylight lofts, cinema soundstages, and Dolby Atmos audio suites across New York, Los Angeles, Chicago, and Austin.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/studios"
              className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-display text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-primary/10 active:scale-95 flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Studios</span>
            </Link>
            <Link
              href="/add-studio"
              className="px-6 py-3 rounded-xl bg-surface-container hover:bg-surface-container-high border border-white/10 text-on-surface font-display text-xs uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <span>Host a Creative Space</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
