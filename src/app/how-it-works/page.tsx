import React from 'react';
import Link from 'next/link';
import {
  Compass,
  Calendar,
  ShieldCheck,
  Video,
  CheckCircle2,
  Lock,
  ArrowRight,
  Layers,
  Sparkles,
  Zap,
  Clock,
  DollarSign,
  HelpCircle,
} from 'lucide-react';

const workflowPhases = [
  {
    phase: '01',
    title: 'Discover & Technical Scouting',
    badge: 'Spec-Verified Directory',
    desc: 'Filter soundstages, daylight lofts, and audio suites by rigorous technical metrics: clear ceiling heights, 3-phase camlock amperage, STC decibel ratings, and drive-in elephant doors.',
    specs: ['Verified 200A-400A Cam-Lok Drops', 'STC 65+ Sound Isolation Audits', '3D Matterport & Accurate Dimensions'],
  },
  {
    phase: '02',
    title: 'Lock Production Hours',
    badge: 'Real-Time Availability',
    desc: 'Select exact shoot dates and hourly call times. Our real-time collision detection prevents double-booking across all synced calendars, giving your crew 100% schedule certainty.',
    specs: ['Double-Booking Collision Prevention', '1-Hour Minimum Slot Resolution', 'Early Grip Crew Load-In Options'],
  },
  {
    phase: '03',
    title: 'Tier-1 Escrow Financial Hold',
    badge: 'Zero Counterparty Risk',
    desc: 'Reserve with transparent hourly pricing, refundable property deposit, and instant digital PDF receipts. Your funds remain securely locked in third-party escrow until 24 hours after shoot wrap.',
    specs: ['48-Hour Full Deposit Refund Policy', 'Automated Dispute Concierge', 'Digital PDF Invoice Receipts'],
  },
  {
    phase: '04',
    title: 'Call Time & Production Wrap',
    badge: 'Seamless On-Set Delivery',
    desc: 'Arrive at the studio with automated digital gate codes, pre-lit cyc rigs, and verified host technical assistance. Wrap the set smoothly and receive instant deposit release upon checkout.',
    specs: ['Automated Digital Door Codes', 'Host Technical Support on Standby', 'Rapid Deposit Release upon Checkout'],
  },
];

const hostBenefits = [
  {
    icon: DollarSign,
    title: 'Maximized Stage Monetization',
    desc: 'Turn dormant soundstage hours into steady production revenue with customizable hourly rates and flexible minimum duration settings.',
  },
  {
    icon: ShieldCheck,
    title: '$1,000,000 Host Protection',
    desc: 'Every reservation is covered by comprehensive property damage and third-party creator liability coverage.',
  },
  {
    icon: Calendar,
    title: 'Automated Calendar Sync',
    desc: 'Connect your Google Calendar or studio booking software to prevent schedule conflicts automatically.',
  },
  {
    icon: Zap,
    title: 'Direct Rolling Payouts',
    desc: 'Receive rapid rolling payouts directly into your bank account via Stripe Connect within 48 hours of shoot wrap.',
  },
];

const faqs = [
  {
    q: 'How does the Aperture Escrow Guarantee protect both parties?',
    a: 'When a creator books a space, the full hourly rate and security deposit are placed into a segregated escrow hold. The host is guaranteed funds upon successful shoot delivery, and the creator is protected against host cancellations or misrepresented facilities.',
  },
  {
    q: 'What is the cancellation and refund policy?',
    a: 'Creators can cancel any reservation up to 48 hours prior to call time for a 100% full refund of all hourly holds and security deposits. Within 48 hours, the refundable damage deposit is still returned in full.',
  },
  {
    q: 'How are power specifications and gear verified?',
    a: 'Every studio listed with 3-phase camlock or pre-hung lighting grids undergoes an onboarding electrical verification check to confirm breaker capacity, phase balance, and roll-up door clearances.',
  },
  {
    q: 'Can creators download official tax and production invoices?',
    a: 'Yes. Every booking immediately generates an official branded PDF invoice complete with invoice numbers, itemized rate cards, host details, and timestamped escrow verification.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="space-y-24 py-12 sm:py-16">
      {/* 1. Hero Introduction */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 text-center space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-[11px] uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-primary" />
          <span>Production Platform Architecture</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-on-surface max-w-4xl mx-auto leading-[1.1]">
          How Creative Workspace <span className="text-primary">Sharing Works</span>
        </h1>

        <p className="font-sans text-sm sm:text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
          From scouting lighting grids and soundproof cycs to wrapping production with full escrow security — explore the 4-phase lifecycle engineered for modern creators.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            href="/studios"
            className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-display text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-primary/10 active:scale-95 flex items-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Scout Studios Now</span>
          </Link>
          <Link
            href="/add-studio"
            className="px-6 py-3 rounded-xl bg-surface-container hover:bg-surface-container-high border border-white/10 text-on-surface font-display text-xs uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <span>Host Your Studio Space</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 2. 4-Phase Production Workflow */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="font-mono text-xs text-primary uppercase tracking-widest font-semibold">
            The Production Lifecycle
          </span>
          <h2 className="font-display text-3xl font-bold text-on-surface">
            Engineered for Creators & Crews
          </h2>
          <p className="font-sans text-xs sm:text-sm text-on-surface-variant">
            Four streamlined phases connecting technical workspace scouting to shoot wrap
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workflowPhases.map((phase) => (
            <div
              key={phase.phase}
              className="bg-surface-container-low border border-white/5 rounded-2xl p-6 sm:p-8 space-y-5 hover:border-primary/40 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xl font-bold text-primary px-3 py-1 rounded-xl bg-primary/10 border border-primary/20">
                  {phase.phase}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-wider text-outline px-2.5 py-0.5 rounded-full bg-surface-container border border-white/5">
                  {phase.badge}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-xl font-bold text-on-surface group-hover:text-primary transition-colors">
                  {phase.title}
                </h3>
                <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                  {phase.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 space-y-2">
                {phase.specs.map((spec) => (
                  <div key={spec} className="flex items-center gap-2 text-xs font-sans text-on-surface">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. For Studio Hosts */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="bg-surface-container-low border border-white/10 rounded-3xl p-8 sm:p-12 space-y-10 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/5">
            <div className="space-y-2">
              <span className="font-mono text-xs text-primary uppercase tracking-widest font-semibold">
                For Studio Owners & Stage Managers
              </span>
              <h2 className="font-display text-3xl font-bold text-on-surface">
                List Your Production Facility
              </h2>
              <p className="font-sans text-xs sm:text-sm text-on-surface-variant max-w-xl">
                Join a curated network of premier soundstages, photo studios, and audio rooms with guaranteed payments and zero booking hassle.
              </p>
            </div>

            <Link
              href="/add-studio"
              className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-display text-xs font-bold uppercase tracking-wider transition-all self-start lg:self-auto shrink-0 shadow-md"
            >
              <span>Publish Studio Listing</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hostBenefits.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-container border border-white/10 flex items-center justify-center text-primary">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-sm text-on-surface">
                    {item.title}
                  </h3>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-6 lg:px-12 space-y-8">
        <div className="text-center space-y-2">
          <span className="font-mono text-xs text-primary uppercase tracking-widest font-semibold">
            Answers & Clarity
          </span>
          <h2 className="font-display text-3xl font-bold text-on-surface">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-surface-container-low border border-white/5 rounded-2xl p-5 sm:p-6 space-y-2"
            >
              <h3 className="font-display font-semibold text-sm sm:text-base text-on-surface flex items-start gap-2.5">
                <span className="text-primary font-mono text-xs mt-0.5">Q:</span>
                <span>{faq.q}</span>
              </h3>
              <p className="font-sans text-xs sm:text-sm text-on-surface-variant pl-5 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
