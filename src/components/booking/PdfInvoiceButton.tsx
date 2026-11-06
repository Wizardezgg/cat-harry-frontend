'use client';

import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { IBooking } from '@/types';
import { Download, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface PdfInvoiceButtonProps {
  booking: IBooking | any;
  variant?: 'button' | 'icon' | 'badge';
  className?: string;
}

export function PdfInvoiceButton({
  booking,
  variant = 'button',
  className = '',
}: PdfInvoiceButtonProps) {
  const [generating, setGenerating] = useState(false);

  const generatePdf = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setGenerating(true);

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const invoiceId = `INV-AP-${(booking._id || '9021').slice(-6).toUpperCase()}`;
      const creationDate = booking.createdAt
        ? new Date(booking.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

      // Background Tone
      doc.setFillColor(18, 19, 24); // #121318 Dark background
      doc.rect(0, 0, 210, 297, 'F');

      // Top Accent Bar (Warm Gold #ffcd8b)
      doc.setFillColor(255, 205, 139);
      doc.rect(0, 0, 210, 5, 'F');

      // Header Brand
      doc.setTextColor(255, 205, 139);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('APERTURE', 18, 22);

      doc.setTextColor(227, 225, 233); // #e3e1e9
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('CREATIVE WORKSPACE & PRODUCTION EXCHANGE', 18, 27);

      // Invoice Details (Right Aligned)
      doc.setTextColor(255, 205, 139);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('OFFICIAL BOOKING INVOICE', 192, 20, { align: 'right' });

      doc.setTextColor(156, 143, 128); // #9c8f80
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Invoice No: ${invoiceId}`, 192, 26, { align: 'right' });
      doc.text(`Date Issued: ${creationDate}`, 192, 31, { align: 'right' });
      doc.text(`Booking Status: ${(booking.status || 'Confirmed').toUpperCase()}`, 192, 36, {
        align: 'right',
      });

      // Divider
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.1);
      doc.line(18, 42, 192, 42);

      // Client & Production Info Box
      doc.setFillColor(26, 27, 32); // #1a1b20 surface-container-low
      doc.roundedRect(18, 48, 174, 40, 2, 2, 'F');

      // Left: Billed To (Creator)
      doc.setTextColor(255, 205, 139);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('BILLED TO (CREATOR):', 24, 56);

      doc.setTextColor(227, 225, 233);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(booking.userName || 'Verified Guest', 24, 63);

      doc.setTextColor(156, 143, 128);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(booking.userEmail || 'guest@aperture.io', 24, 69);
      doc.text(`Account Verified • Escrow Protected`, 24, 75);

      // Right: Production Workspace Details
      doc.setTextColor(255, 205, 139);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('RESERVED WORKSPACE:', 110, 56);

      doc.setTextColor(227, 225, 233);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      const studioTitle = booking.studioTitle || 'Production Workspace';
      const truncatedTitle = studioTitle.length > 36 ? studioTitle.slice(0, 34) + '...' : studioTitle;
      doc.text(truncatedTitle, 110, 63);

      doc.setTextColor(156, 143, 128);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Reservation Date: ${booking.bookingDate || new Date().toISOString().split('T')[0]}`, 110, 69);
      doc.text(
        `Time Slot: ${booking.startTime || '10:00'} - ${booking.endTime || '14:00'} (${
          booking.totalHours || 4
        } hrs)`,
        110,
        75
      );

      // Financial Calculation
      const hourlyRate = booking.studioHourlyRate || 145;
      const totalHours = booking.totalHours || 4;
      const subtotal = hourlyRate * totalHours;
      const deposit = booking.securityDeposit || 150;
      const grandTotal = booking.totalAmount || subtotal + deposit;

      // Table of Line Items
      autoTable(doc, {
        startY: 96,
        margin: { left: 18, right: 18 },
        theme: 'plain',
        headStyles: {
          fillColor: [30, 31, 37], // #1e1f25
          textColor: [255, 205, 139],
          fontStyle: 'bold',
          fontSize: 9,
          cellPadding: 4,
        },
        bodyStyles: {
          fillColor: [26, 27, 32],
          textColor: [227, 225, 233],
          fontSize: 9,
          cellPadding: 4,
        },
        alternateRowStyles: {
          fillColor: [20, 21, 26],
        },
        head: [['ITEM & SPECIFICATION', 'HOURS / QTY', 'HOURLY RATE', 'TOTAL (USD)']],
        body: [
          [
            `Studio Stage Reservation (${studioTitle})`,
            `${totalHours.toFixed(1)} hrs`,
            `$${hourlyRate.toFixed(2)}/hr`,
            `$${subtotal.toFixed(2)}`,
          ],
          [
            'Refundable Property Damage Escrow Deposit',
            '1 Event',
            `$${deposit.toFixed(2)}`,
            `$${deposit.toFixed(2)}`,
          ],
          [
            'Aperture Verified Power & Technical Assurance',
            'Complimentary',
            '$0.00',
            '$0.00',
          ],
        ],
      });

      // Total Calculation Box
      const finalY = (doc as any).lastAutoTable?.finalY || 140;

      doc.setFillColor(26, 27, 32);
      doc.roundedRect(120, finalY + 6, 72, 32, 2, 2, 'F');

      doc.setTextColor(156, 143, 128);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('Studio Subtotal:', 126, finalY + 14);
      doc.text(`$${subtotal.toFixed(2)}`, 186, finalY + 14, { align: 'right' });

      doc.text('Security Deposit:', 126, finalY + 20);
      doc.text(`$${deposit.toFixed(2)}`, 186, finalY + 20, { align: 'right' });

      doc.setTextColor(255, 205, 139);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Total Escrow Hold:', 126, finalY + 30);
      doc.text(`$${grandTotal.toFixed(2)}`, 186, finalY + 30, { align: 'right' });

      // Escrow Terms & Trust Box
      doc.setFillColor(20, 21, 26);
      doc.roundedRect(18, finalY + 44, 174, 30, 2, 2, 'F');

      doc.setTextColor(255, 205, 139);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('ESCROW PAYMENT & CANCELLATION PROTOCOL', 24, finalY + 52);

      doc.setTextColor(156, 143, 128);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(
        '1. Payment is held in secure third-party escrow until 24 hours after shoot wrap time.',
        24,
        finalY + 58
      );
      doc.text(
        '2. Free cancellation is permitted up to 48 hours prior to call time for a full 100% refund.',
        24,
        finalY + 63
      );
      doc.text(
        '3. Refundable security deposit is released automatically upon host wrap verification.',
        24,
        finalY + 68
      );

      // Footer
      doc.setTextColor(100, 100, 110);
      doc.setFontSize(7.5);
      doc.text(
        'Aperture Platform Inc. • Certified Peer-to-Peer Creative Studio Exchange • support@aperture.io',
        105,
        285,
        { align: 'center' }
      );

      // Save PDF
      const filename = `Aperture_Invoice_${(booking._id || 'booking').slice(-6)}.pdf`;
      doc.save(filename);

      toast.success('Invoice Downloaded', {
        description: `Saved ${filename} to your device.`,
      });
    } catch (err: any) {
      toast.error('Failed to generate PDF', {
        description: err?.message || 'Could not build PDF invoice.',
      });
    } finally {
      setGenerating(false);
    }
  };

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={generatePdf}
        disabled={generating}
        className={`p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface hover:text-primary transition-all border border-white/5 disabled:opacity-50 ${className}`}
        title="Download PDF Invoice Receipt"
      >
        <Download className={`w-4 h-4 ${generating ? 'animate-bounce text-primary' : ''}`} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={generatePdf}
      disabled={generating}
      className={`px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high border border-white/10 text-on-surface hover:text-primary font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 active:scale-95 ${className}`}
    >
      <Download className={`w-3.5 h-3.5 text-primary ${generating ? 'animate-bounce' : ''}`} />
      <span>{generating ? 'Exporting PDF...' : 'Download Invoice'}</span>
    </button>
  );
}
