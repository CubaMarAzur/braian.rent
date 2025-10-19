'use client';

import React from 'react';
import LogoutButton from '@/components/auth/LogoutButton';
import type { PropertyWithDetails } from '@/types/property';

interface DashboardPreviewProps {
  properties: PropertyWithDetails[];
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function DashboardPreview({
  properties,
  user,
}: DashboardPreviewProps) {
  // Calculate total rent from all properties
  const totalRent = properties.reduce((sum, property) => {
    return sum + (property.currentPayment?.amountDue || 0);
  }, 0);

  // Count properties with signed contracts
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const signedContracts = properties.filter(property =>
    property.documents.some(doc => doc.type === 'LEASE_AGREEMENT')
  ).length;

  // Count properties with pending audits
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const pendingAudits = properties.filter(
    property =>
      !property.documents.some(doc => doc.type === 'HANDOVER_PROTOCOL')
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 py-8 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-lg font-semibold text-gray-800">
              Braian Dashboard
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Zalogowany jako: <span className="font-medium">{user.name}</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              alert(
                'Funkcjonalność dodawania nieruchomości będzie dostępna wkrótce!'
              );
            }}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
          >
            <svg
              className="w-4 h-4 mr-2"
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

      {/* Main Dashboard Card */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Section - Czynsz */}
            <div className="space-y-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Czynsz</h2>
              </div>

              <div className="text-5xl font-black text-green-600 mb-8 drop-shadow-sm">
                {new Intl.NumberFormat('pl-PL').format(totalRent)} zł
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-green-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={3}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-800 font-medium">
                      Umowa podpisana
                    </span>
                  </div>
                  <span className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-bold shadow-md">
                    Gotowe
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-blue-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={3}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-800 font-medium">
                      Audyt nieruchomości
                    </span>
                  </div>
                  <span className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-bold shadow-md">
                    W toku
                  </span>
                </div>
              </div>
            </div>

            {/* Right Section - Nieruchomości */}
            <div className="space-y-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Nieruchomości
                </h2>
              </div>

              <div className="text-5xl font-black text-blue-600 mb-8 drop-shadow-sm">
                {properties.length}
              </div>

              <div className="space-y-4">
                {properties.map((property, index) => (
                  <div
                    key={property.id}
                    className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-800 text-lg">
                          {property.address}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">
                          {property.tenant
                            ? property.tenant.name
                            : 'Brak najemcy'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-gray-800 text-lg">
                        {property.currentPayment?.amountDue
                          ? `${new Intl.NumberFormat('pl-PL').format(property.currentPayment.amountDue)} zł`
                          : 'Brak danych'}
                      </div>
                      <div
                        className={`text-sm font-bold px-3 py-1 rounded-full ${
                          property.currentPayment?.status === 'PAID'
                            ? 'bg-green-100 text-green-700'
                            : property.currentPayment?.status === 'UNPAID'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {property.currentPayment?.status === 'PAID'
                          ? 'Opłacone'
                          : property.currentPayment?.status === 'UNPAID'
                            ? 'Nieopłacone'
                            : 'Brak danych'}
                      </div>
                    </div>
                  </div>
                ))}

                {properties.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <svg
                      className="w-12 h-12 mx-auto mb-4 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <p>Brak nieruchomości</p>
                    <p className="text-sm">
                      Dodaj pierwszą nieruchomość, aby rozpocząć
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
