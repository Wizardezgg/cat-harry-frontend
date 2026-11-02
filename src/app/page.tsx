export default function HomePage() {
  return (
    <main className="w-full px-6 lg:px-12 py-16 flex flex-col items-center justify-center text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-white/10 text-primary text-xs font-mono tracking-wider uppercase mb-6">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        Architectural Studio Directory
      </div>
      <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-on-surface max-w-3xl leading-tight">
        High-Caliber Creative Spaces for <span className="text-primary">Visionary Productions</span>
      </h1>
      <p className="mt-4 text-on-surface-variant font-sans text-base max-w-xl">
        Curated soundstages, natural daylight cycloramas, analog mixing suites, and film studios ready for on-demand booking.
      </p>
    </main>
  );
}
