import Hero from '@/components/landing/Hero';
import Benefits from '@/components/landing/Benefits';
import DashboardPreview from '@/components/landing/DashboardPreview';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-sky-50">
      <Hero />
      <section className="mx-auto mt-10 w-full max-w-6xl px-4">
        <Benefits />
      </section>
      <section className="mx-auto mt-16 w-full max-w-6xl px-4 pb-24">
        <DashboardPreview />
      </section>
    </main>
  );
}
