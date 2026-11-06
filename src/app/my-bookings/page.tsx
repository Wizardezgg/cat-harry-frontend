'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { IBooking, BookingStatus } from '@/types';
import { fetcher } from '@/lib/api';
import { PdfInvoiceButton } from '@/components/booking/PdfInvoiceButton';
import { toast } from 'sonner';
import {
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Search,
  Plus,
  AlertTriangle,
  X,
  Eye,
  CheckCircle2,
  DollarSign,
  Layers,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Video,
} from 'lucide-react';

function MyBookingsContent() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | BookingStatus>('All');

  // Cancel Modal State
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<IBooking | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    async function loadBookings() {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        const emailQuery = `?userEmail=${encodeURIComponent(user.email)}`;
        const res = await fetcher<{ success: boolean; bookings: IBooking[] }>(
          `/bookings/my-bookings${emailQuery}`
        );
        if (res.success && res.bookings) {
          setBookings(res.bookings);
        } else {
          setBookings([]);
        }
      } catch {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, [user]);

  // Open Cancel Modal
  const openCancelModal = (b: IBooking) => {
    setBookingToCancel(b);
    setCancelModalOpen(true);
  };

  const closeCancelModal = () => {
    setCancelModalOpen(false);
    setBookingToCancel(null);
  };

  // Perform Cancellation
  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;
    setCancelling(true);

    try {
      await fetcher(`/bookings/${bookingToCancel._id}/cancel`, {
        method: 'PATCH',
      }).catch(() => null);

      // Update state locally
      setBookings((prev) =>
        prev.map((item) =>
          item._id === bookingToCancel._id ? { ...item, status: 'Cancelled' } : item
        )
      );

      toast.success('Reservation Cancelled', {
        description: `Booking #${bookingToCancel._id.slice(-6).toUpperCase()} has been cancelled. Full deposit released.`,
      });
      closeCancelModal();
    } catch {
      toast.error('Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        b.studioTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.bookingDate.includes(searchQuery);

      const matchesStatus = statusFilter === 'All' || b.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  // Metrics
  const confirmedCount = bookings.filter((b) => b.status === 'Confirmed').length;
  const pendingCount = bookings.filter((b) => b.status === 'Pending').length;
  const completedCount = bookings.filter((b) => b.status === 'Completed').length;
  const totalInEscrow = bookings
    .filter((b) => b.status === 'Confirmed' || b.status === 'Pending')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  // Status Badge Helper
  const renderStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px] uppercase font-bold tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Confirmed</span>
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono text-[10px] uppercase font-bold tracking-wider">
            <Clock className="w-3 h-3 text-primary" />
            <span>Pending Review</span>
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono text-[10px] uppercase font-bold tracking-wider">
            <CheckCircle2 className="w-3 h-3 text-blue-400" />
            <span>Completed</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-mono text-[10px] uppercase font-bold tracking-wider">
            <X className="w-3 h-3 text-red-400" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 sm:py-14 space-y-8">
      {/* 1. Header & Context */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-on-surface-variant font-mono text-xs uppercase tracking-widest">
            <span>Creative Dashboard</span>
            <span className="opacity-40">/</span>
            <span className="text-primary font-semibold">Production Sessions</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-on-surface">
            My Workspace Bookings
          </h1>
          <p className="font-sans text-xs sm:text-sm text-on-surface-variant max-w-2xl leading-relaxed">
            Manage active soundstage reservations, access digital entry codes, download escrow invoices, or modify call times.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            href="/studios"
            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-display text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-primary/10 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Book New Studio</span>
          </Link>
        </div>
      </section>

      {/* 2. Key Metrics Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-surface-container-low border border-white/5 p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden group hover:border-primary/30 transition-colors shadow-sm">
          <div className="flex items-center justify-between pb-3">
            <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
              Upcoming Shoots
            </span>
            <Calendar className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="font-display text-3xl font-bold text-on-surface leading-none">
              {confirmedCount + pendingCount} Sessions
            </span>
            <div className="flex items-center gap-2 mt-2">
              <span className="font-sans text-xs text-on-surface-variant">
                {confirmedCount} confirmed • {pendingCount} awaiting approval
              </span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>

        {/* Metric 2 */}
        <div className="bg-surface-container-low border border-white/5 p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden group hover:border-primary/30 transition-colors shadow-sm">
          <div className="flex items-center justify-between pb-3">
            <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
              Escrow Protection Hold
            </span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="font-display text-3xl font-bold text-on-surface leading-none">
              ${totalInEscrow.toLocaleString()}
            </span>
            <div className="flex items-center gap-1.5 mt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-sans text-xs text-on-surface-variant">Held securely in Tier-1 Escrow</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
        </div>

        {/* Metric 3 */}
        <div className="bg-surface-container-low border border-white/5 p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden group hover:border-primary/30 transition-colors shadow-sm">
          <div className="flex items-center justify-between pb-3">
            <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
              Completed Productions
            </span>
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <span className="font-display text-3xl font-bold text-on-surface leading-none">
              {completedCount} Productions
            </span>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="font-sans text-xs text-on-surface-variant">Wrap releases confirmed</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
        </div>

        {/* Metric 4 */}
        <div className="bg-surface-container-low border border-white/5 p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden group hover:border-primary/30 transition-colors shadow-sm">
          <div className="flex items-center justify-between pb-3">
            <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
              Cancellation Policy
            </span>
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="font-display text-2xl font-bold text-primary leading-none">
              48h Window
            </span>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="font-sans text-xs text-on-surface-variant">100% deposit refund prior to call</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>
      </section>

      {/* 3. Toolbar & Status Filter */}
      <section className="bg-surface-container-low border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative min-w-[240px] flex-1 max-w-md">
          <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by studio, date, or booking ID..."
            className="w-full pl-10 pr-4 py-2 bg-surface-container border border-white/5 text-on-surface placeholder:text-outline text-xs font-sans rounded-xl focus:outline-none focus:border-primary/40 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-surface-container border border-white/5 p-1 rounded-xl overflow-x-auto">
          {(['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg font-mono text-[11px] uppercase tracking-wider whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </section>

      {/* 4. Bookings Roster */}
      <section className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="py-16 px-6 text-center rounded-2xl bg-surface-container-low border border-white/5 flex flex-col items-center justify-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-surface-container border border-white/10 flex items-center justify-center text-outline">
              <Calendar className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-bold text-lg text-on-surface">
                No reservations found
              </h3>
              <p className="font-sans text-xs text-on-surface-variant max-w-sm mx-auto">
                {searchQuery || statusFilter !== 'All'
                  ? 'No bookings match your selected criteria. Try adjusting filters.'
                  : 'You have not booked any creative workspaces yet. Browse verified production studios and book your next shoot.'}
              </p>
            </div>
            <Link
              href="/studios"
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-display text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Explore Studios</span>
            </Link>
          </div>
        ) : (
          filteredBookings.map((b) => (
            <article
              key={b._id}
              className="bg-surface-container-low border border-white/5 rounded-2xl p-5 lg:p-6 flex flex-col lg:flex-row gap-6 group hover:border-primary/30 hover:bg-surface-container transition-all shadow-md"
            >
              {/* Studio Thumbnail */}
              <div className="relative w-full lg:w-72 h-48 lg:h-auto rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-highest">
                <img
                  src={b.studioImage}
                  alt={b.studioTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute top-3 left-3">{renderStatusBadge(b.status)}</div>
                <div className="absolute bottom-3 left-3 bg-surface/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono text-outline uppercase border border-white/5">
                  ID: #{b._id.slice(-6).toUpperCase()}
                </div>
              </div>

              {/* Booking Information */}
              <div className="flex flex-col justify-between flex-1 min-w-0 space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Link
                      href={`/studios/${b.studioId}`}
                      className="font-display text-lg sm:text-xl font-bold text-on-surface tracking-tight group-hover:text-primary transition-colors line-clamp-1 hover:underline"
                    >
                      {b.studioTitle}
                    </Link>

                    {/* Total Amount Tag */}
                    <div className="text-right">
                      <span className="font-display text-xl font-bold text-primary">
                        ${b.totalAmount.toFixed(2)}
                      </span>
                      <span className="font-mono text-xs text-on-surface-variant"> hold</span>
                    </div>
                  </div>

                  {/* Shoot Schedule Details Strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-surface-container/60 border border-white/5">
                    <div className="flex items-center gap-2 text-xs font-sans text-on-surface">
                      <Calendar className="w-4 h-4 text-primary shrink-0" />
                      <div>
                        <div className="font-mono text-[10px] text-outline uppercase">
                          Shoot Date
                        </div>
                        <div className="font-semibold">{b.bookingDate}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-sans text-on-surface">
                      <Clock className="w-4 h-4 text-tertiary shrink-0" />
                      <div>
                        <div className="font-mono text-[10px] text-outline uppercase">
                          Call Time Window
                        </div>
                        <div className="font-semibold">
                          {b.startTime} - {b.endTime} ({b.totalHours} hrs)
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-sans text-on-surface">
                      <DollarSign className="w-4 h-4 text-primary shrink-0" />
                      <div>
                        <div className="font-mono text-[10px] text-outline uppercase">
                          Hourly Rate
                        </div>
                        <div className="font-semibold">${b.studioHourlyRate} / hour</div>
                      </div>
                    </div>
                  </div>

                  {/* Special Requests if present */}
                  {b.specialRequests && (
                    <p className="font-sans text-xs text-on-surface-variant line-clamp-2 italic bg-surface-container/40 p-2.5 rounded-lg border border-white/5">
                      <span className="font-mono not-italic font-semibold text-outline mr-1.5 uppercase text-[10px]">
                        Notes:
                      </span>
                      {b.specialRequests}
                    </p>
                  )}
                </div>

                {/* Card Actions Ribbon */}
                <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-outline">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                    <span>Protected by Escrow Guarantee</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Branded PDF Invoice Generator Button */}
                    <PdfInvoiceButton booking={b} />

                    {/* Cancel Booking (available for Pending or Confirmed) */}
                    {(b.status === 'Pending' || b.status === 'Confirmed') && (
                      <button
                        type="button"
                        onClick={() => openCancelModal(b)}
                        className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-red-500/10 text-on-surface-variant hover:text-red-400 border border-white/10 hover:border-red-500/30 font-mono text-xs uppercase tracking-wider transition-all"
                      >
                        Cancel Booking
                      </button>
                    )}

                    {/* View Studio Public Details */}
                    <Link
                      href={`/studios/${b.studioId}`}
                      className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high border border-white/10 text-on-surface font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-primary" />
                      <span>Studio Specs</span>
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </section>

      {/* 5. Custom Cancel Reservation Modal */}
      {cancelModalOpen && bookingToCancel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg rounded-2xl bg-surface-container border border-white/10 p-6 sm:p-7 shadow-2xl flex flex-col gap-5 text-on-surface">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-on-surface tracking-tight">
                    Cancel Reservation?
                  </h3>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-red-400">
                    Booking #{bookingToCancel._id.slice(-6).toUpperCase()}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={closeCancelModal}
                disabled={cancelling}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Explanation & Refund Terms */}
            <p className="font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Are you sure you want to cancel your shoot slot for{' '}
              <strong className="text-on-surface font-semibold">
                {bookingToCancel.studioTitle}
              </strong>{' '}
              on <strong className="text-on-surface">{bookingToCancel.bookingDate}</strong>?
            </p>

            <div className="bg-surface-container-lowest border border-white/5 rounded-xl p-3.5 space-y-2 font-sans text-xs text-on-surface-variant">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>100% Escrow Hold Refundable</span>
              </div>
              <p className="leading-relaxed">
                Your full deposit hold (${bookingToCancel.totalAmount.toFixed(2)}) will be released back to your payment method within 2-3 business days.
              </p>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={closeCancelModal}
                disabled={cancelling}
                className="px-4 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-display text-xs uppercase tracking-wider transition-colors"
              >
                Keep Reservation
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={cancelling}
                className="px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-display text-xs uppercase tracking-wider font-bold shadow-lg shadow-red-500/20 transition-all disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <ProtectedRoute>
      <MyBookingsContent />
    </ProtectedRoute>
  );
}
