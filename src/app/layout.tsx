import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'StudioSpace | Production Studios & Creative Workspaces',
  description: 'Peer-to-peer sharing platform for photo studios, film stages, sound suites, and artist spaces.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-surface font-sans text-on-surface antialiased selection:bg-primary-container/20 selection:text-primary min-h-screen flex flex-col">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <div className="flex-1 pt-20">
              {children}
            </div>
            <Footer />
            <Toaster position="top-right" richColors theme="dark" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
