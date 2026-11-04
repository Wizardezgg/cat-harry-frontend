'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { IStudio } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { fetcher } from '@/lib/api';
import { toast } from 'sonner';
import { X, Calendar, Clock, ShieldCheck, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface BookingModalProps {
  studio: IStudio;
  isOpen: boolean;
  onClose: () => void;
  initialDate?: string;
  initialStartTime?: string;
  initialEndTime?: string;
}

export function BookingModal({
  studio,
  isOpen,
  onClose,
  initialDate = '',
  initialStartTime = '10:00',
  initialEndTime = '14:00',
}: BookingModalProps) {
  const { user } = useAuth();
  const router = useRouter();

  // Tomorrow's date formatted as YYYY-MM-DD
  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  const [bookingDate, setBookingDate] = useState(initialDate || tomorrow);
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);
  const [specialRequests, setSpecialRequests] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Rate and Deposit calculation
  const hourlyRate = studio.hourlyRate || (studio as any).pricePerHour || 95;
  const securityDeposit = studio.securityDeposit || 150;

  // Calculate total hours
  const totalHours = useMemo(() => {
    if (!startTime || !endTime) return 0;
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const startDecimal = startH + startM / 60;
    const endDecimal = endH + endM / 60;
    const diff = endDecimal - startDecimal;
    return diff > 0 ? diff : 0;
  }, [startTime, endTime]);

  const studioSubtotal = totalHours * hourlyRate;
  const grandTotal = studioSubtotal + (totalHours > 0 ? securityDeposit : 0);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Authentication required', {
        description: 'Please sign in with your creator account to confirm booking.',
      });
      router.push('/login');
      return;
    }

    if (!bookingDate) {
      toast.error('Please choose a reservation date.');
      return;
    }

    if (totalHours <= 0) {
      toast.error('Invalid Time Slot', {
        description: 'End time must be later than start time (minimum 1 hour).',
      });
      return;
    }

    if (totalHours < 1) {
      toast.error('Minimum Duration', {
        description: 'Studio booking minimum is 1 hour.',
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        studioId: studio._id,
        studioTitle: studio.title,
        studioImage:
          studio.imageUrl ||
          ((studio as any).images && (studio as any).images[0]) ||
          'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1000&q=80',
        studioLocation:
          typeof studio.location === 'string'
            ? studio.location
            : `${studio.location?.city || ''}, ${studio.location?.state || ''}`,
        pricePerHour: hourlyRate,
        bookingDate,
        startTime,
        endTime,
        totalHours,
        totalPrice: grandTotal,
        specialRequests,
      };

      const res = await fetcher<{ success: boolean; message: string; bookingId?: string }>('/bookings', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      toast.success('Reservation Confirmed!', {
        description: `Your shoot at ${studio.title} is locked in.`,
      });
      onClose();
      router.push('/my-bookings');
    } catch (err: any) {
      // Challenge 2: Collision detection feedback
      const errorMsg = err.message || 'Booking conflict detected.';
      toast.error('Scheduling Conflict (HTTP 409)', {
        description: errorMsg,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-surface-container border border-white/10 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-mono uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3" />
              <span>Instant Escrow Reservation</span>
            </div>
            <h2 className="font-display text-xl font-bold text-on-surface">
              Reserve Workspace
            </h2>
            <p className="text-xs text-on-surface-variant font-sans mt-0.5 line-clamp-1">
              {studio.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-surface-container-high border border-white/5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Reservation Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase text-outline flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              Production Date
            </label>
            <input
              type="date"
              min={tomorrow}
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-surface-container-low border border-white/10 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary/60 font-sans"
            />
          </div>

          {/* Time Slot Pickers */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-outline flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
                Call Time (Start)
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-surface-container-low border border-white/10 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary/60 font-sans"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-outline flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
                Wrap Time (End)
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-surface-container-low border border-white/10 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary/60 font-sans"
              />
            </div>
          </div>

          {/* Special Requests or Gear Load-in */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase text-outline">
              Special Requests / Crew Load-in Notes
            </label>
            <textarea
              rows={2}
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="e.g. 5-ton grip truck parking, hazing permits, early lighting tech load-in..."
              className="w-full px-4 py-2.5 bg-surface-container-low border border-white/10 rounded-xl text-xs text-on-surface placeholder:text-outline/60 focus:outline-none focus:border-primary/60 font-sans resize-none"
            />
          </div>

          {/* Transparent Financial Breakdown */}
          <div className="p-4 rounded-2xl bg-surface-container-low border border-white/5 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-on-surface-variant font-sans">
              <span>Hourly Rate</span>
              <span className="font-mono text-on-surface">${hourlyRate} / hr</span>
            </div>
            <div className="flex items-center justify-between text-xs text-on-surface-variant font-sans">
              <span>Shoot Duration</span>
              <span className="font-mono text-on-surface">{totalHours > 0 ? `${totalHours.toFixed(1)} hrs` : '0 hrs'}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-on-surface-variant font-sans">
              <span>Studio Subtotal</span>
              <span className="font-mono text-on-surface">${studioSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-on-surface-variant font-sans">
              <span className="flex items-center gap-1">
                Refundable Damage Deposit
                <span className="text-[10px] text-outline">(Returned at wrap)</span>
              </span>
              <span className="font-mono text-on-surface">${securityDeposit.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-sm font-bold text-on-surface">
              <span>Total Estimated Hold</span>
              <span className="font-mono text-primary text-base">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Escrow Guarantee */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container-high/60 border border-white/5 text-[11px] text-on-surface-variant">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Your payment is held in escrow until 24 hours after shoot wrap. Free cancellation up to 48 hours prior to call time.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="w-1/3 py-3 px-4 rounded-xl bg-surface-container-high border border-white/10 text-xs font-semibold text-on-surface hover:bg-surface-container-highest transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || totalHours <= 0}
              className="w-2/3 py-3 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all shadow-lg shadow-primary/10 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span>Confirming Slot...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Lock In Slot</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
