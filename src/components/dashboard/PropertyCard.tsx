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
          className="p-3 rounded-full hover:bg-blue-50 transition-colors border border-gray-200 hover:border-blue-300"
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
      <div className="mx-4 px-8 py-6 bg-white rounded-2xl shadow-xl border border-gray-200 text-xl font-bold text-gray-800 min-w-[350px] text-center">
        <div className="flex items-center justify-center mb-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
          <span className="text-lg font-semibold text-gray-600">
            Nieruchomość
          </span>
        </div>
        <div className="text-gray-800 font-bold">{property.address}</div>
      </div>
      {totalProperties > 1 && (
        <button
          onClick={onNext}
          className="p-3 rounded-full hover:bg-blue-50 transition-colors border border-gray-200 hover:border-blue-300"
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
