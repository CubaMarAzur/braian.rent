'use client';

/**
 * Property selector component
 * Client component for interactive property switching
 */

import type { PropertyWithDetails } from '@/types/property';

interface PropertyCardProps {
  property: PropertyWithDetails;
  totalProperties: number;
  onPrevious: () => void;
  onNext: () => void;
}

export default function PropertyCard({
  property,
  totalProperties,
  onPrevious,
  onNext,
}: PropertyCardProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      {totalProperties > 1 && (
        <button
          onClick={onPrevious}
          className="p-2 rounded-full hover:bg-gray-200 transition"
          aria-label="Poprzednia nieruchomość"
        >
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}
      <div className="mx-4 px-6 py-3 bg-white rounded-xl shadow text-lg font-medium text-gray-800 min-w-[260px] text-center">
        {property.address}
      </div>
      {totalProperties > 1 && (
        <button
          onClick={onNext}
          className="p-2 rounded-full hover:bg-gray-200 transition"
          aria-label="Następna nieruchomość"
        >
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
