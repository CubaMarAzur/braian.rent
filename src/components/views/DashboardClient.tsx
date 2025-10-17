'use client';

/**
 * Dashboard Client Component
 *
 * This is a "client island" that handles interactivity (property switching).
 * Data is fetched on the server and passed as props for better performance.
 */

import { useState } from 'react';
import LogoutButton from '@/components/auth/LogoutButton';
import PropertyCard from '@/components/dashboard/PropertyCard';
import TenantCard from '@/components/dashboard/TenantCard';
import PaymentCard from '@/components/dashboard/PaymentCard';
import DocumentsCard from '@/components/dashboard/DocumentsCard';
import type { PropertyWithDetails } from '@/types/property';

interface DashboardClientProps {
  properties: PropertyWithDetails[];
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function DashboardClient({
  properties,
  user,
}: DashboardClientProps) {
  const [propertyIdx, setPropertyIdx] = useState(0);

  if (properties.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-5xl mx-auto mb-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Zalogowany jako: <span className="font-medium">{user.name}</span>
          </div>
          <LogoutButton />
        </div>

        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white rounded-2xl shadow p-8 max-w-md text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Brak nieruchomości
            </h3>
            <p className="text-gray-600 mb-6">
              Nie masz jeszcze żadnych nieruchomości. Dodaj pierwszą, aby
              rozpocząć.
            </p>
            <button
              onClick={() => {
                // TODO: Implement add property functionality
                alert(
                  'Funkcjonalność dodawania nieruchomości będzie dostępna wkrótce!'
                );
              }}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Dodaj nieruchomość
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentProperty = properties[propertyIdx];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Header with user info and logout */}
      <div className="max-w-5xl mx-auto mb-6 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Zalogowany jako: <span className="font-medium">{user.name}</span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              // TODO: Implement add property functionality
              alert(
                'Funkcjonalność dodawania nieruchomości będzie dostępna wkrótce!'
              );
            }}
            className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Dodaj nieruchomość
          </button>
          <LogoutButton />
        </div>
      </div>

      {/* Property selector */}
      <PropertyCard
        property={currentProperty}
        totalProperties={properties.length}
        onPrevious={() =>
          setPropertyIdx(idx => (idx === 0 ? properties.length - 1 : idx - 1))
        }
        onNext={() =>
          setPropertyIdx(idx => (idx === properties.length - 1 ? 0 : idx + 1))
        }
      />

      {/* Property counter */}
      {properties.length > 1 && (
        <div className="text-center text-sm text-gray-500 mb-4">
          Nieruchomość {propertyIdx + 1} z {properties.length}
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <TenantCard tenant={currentProperty.tenant} />
        <PaymentCard payment={currentProperty.currentPayment} />
        <DocumentsCard documents={currentProperty.documents} />
      </div>
    </div>
  );
}
