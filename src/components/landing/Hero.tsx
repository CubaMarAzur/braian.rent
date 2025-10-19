'use client';

import { Button } from '@/components/ui/button';
import { Apple, Chrome, Facebook, Phone } from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function Hero() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-16 text-center">
      {/* Main Headline */}
      <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
        Oszczędź 80% kosztów.
        <br />
        Zarządzaj najmem z Braianem.
      </h1>

      {/* Description */}
      <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
        Pełna kontrola nad Twoimi nieruchomościami z asystentem AI.
        <br />
        Bez ukrytych opłat, bez pośredników.
      </p>

      {/* SSO Buttons - Main CTA */}
      <div className="mt-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          {/* Google - Most prominent */}
          <Button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 px-6 py-4 text-lg font-semibold text-white shadow-lg hover:from-indigo-600 hover:to-blue-600 transition-all duration-200"
          >
            <Chrome className="h-5 w-5" />
            Kontynuuj z Google
          </Button>

          {/* Apple */}
          <Button
            onClick={() => signIn('apple', { callbackUrl: '/dashboard' })}
            variant="outline"
            className="flex items-center gap-3 rounded-xl border-2 border-gray-300 bg-white px-6 py-4 text-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200"
          >
            <Apple className="h-5 w-5" />
            Kontynuuj z Apple
          </Button>

          {/* Facebook */}
          <Button
            onClick={() => signIn('facebook', { callbackUrl: '/dashboard' })}
            variant="outline"
            className="flex items-center gap-3 rounded-xl border-2 border-gray-300 bg-white px-6 py-4 text-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200"
          >
            <Facebook className="h-5 w-5" />
            Kontynuuj z Facebook
          </Button>
        </div>

        {/* Phone Link */}
        <div className="mt-6">
          <button
            onClick={() => signIn('phone', { callbackUrl: '/dashboard' })}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors mx-auto"
          >
            <Phone className="h-4 w-4" />
            Numer telefonu (SMS)
          </button>
        </div>

        {/* Terms */}
        <div className="mt-8">
          <p className="text-xs text-gray-500">
            Kontynuując, akceptujesz{' '}
            <a href="/terms" className="underline hover:text-gray-700">
              Regulamin
            </a>{' '}
            i{' '}
            <a href="/privacy" className="underline hover:text-gray-700">
              Politykę prywatności
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
