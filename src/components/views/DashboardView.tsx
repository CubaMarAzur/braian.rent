'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import LogoutButton from '@/components/auth/LogoutButton';
import type {
  PropertyWithDetails,
  ApiResponse,
  PaymentStatus,
  DocumentType,
} from '@/types/property';

// Helper function for document status icon
function getDocumentStatusIcon(
  docType: DocumentType,
  expiresAt: string | null
) {
  const isExpiringSoon =
    expiresAt &&
    new Date(expiresAt) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const isExpired = expiresAt && new Date(expiresAt) < new Date();

  if (isExpired || docType === 'INSURANCE' || docType === 'HANDOVER_PROTOCOL') {
    return (
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-600">
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 16 16"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 4v4m0 3.5h.01"
          />
          <circle
            cx="8"
            cy="8"
            r="7"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </span>
    );
  }

  if (isExpiringSoon) {
    return (
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-yellow-100 text-yellow-600">
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 16 16"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 4v4m0 3.5h.01"
          />
        </svg>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600">
      <svg
        className="w-3 h-3"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 16 16"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8l3 3 5-5" />
      </svg>
    </span>
  );
}

// Helper function for payment status badge
function getPaymentStatusBadge(status: PaymentStatus) {
  const statusConfig = {
    UNPAID: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      label: 'Nieopłacona',
      icon: true,
    },
    PARTIALLY_PAID: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      label: 'Częściowo opłacona',
      icon: true,
    },
    PAID: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      label: 'Opłacona',
      icon: false,
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full ${config.bg} ${config.text} text-sm font-medium`}
    >
      {config.icon && (
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 20 20"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.29 3.86l7.39 13.48A1 1 0 0116.61 19H3.39a1 1 0 01-.87-1.66l7.39-13.48a1 1 0 011.74 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01"
          />
        </svg>
      )}
      {config.label}
    </span>
  );
}

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// Helper function to format amount
function formatAmount(amount: number): string {
  return new Intl.NumberFormat('pl-PL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Helper function to get initials from name
function getInitials(name: string): string {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

// Helper function to translate document type
function getDocumentLabel(type: DocumentType): string {
  const labels: Record<DocumentType, string> = {
    LEASE_AGREEMENT: 'Umowa Najmu',
    INSURANCE: 'Ubezpieczenie OC',
    HANDOVER_PROTOCOL: 'Protokół Zdawczo-Odbiorczy',
    OTHER: 'Inny dokument',
  };
  return labels[type] || type;
}

const DashboardView: React.FC = () => {
  const { data: session } = useSession();
  const [properties, setProperties] = useState<PropertyWithDetails[]>([]);
  const [propertyIdx, setPropertyIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch properties on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/v1/properties');
        const result: ApiResponse<PropertyWithDetails[]> =
          await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Nie udało się pobrać danych');
        }

        if (result.data && result.data.length > 0) {
          setProperties(result.data);
        } else {
          setError('Brak nieruchomości do wyświetlenia');
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Wystąpił nieznany błąd';
        setError(errorMessage);
        console.error('Error fetching properties:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const prevProperty = () => {
    setPropertyIdx(idx => (idx === 0 ? properties.length - 1 : idx - 1));
  };

  const nextProperty = () => {
    setPropertyIdx(idx => (idx === properties.length - 1 ? 0 : idx + 1));
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Ładowanie danych...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow p-8 max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nie udało się załadować danych
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }

  // No properties state
  if (properties.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
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
          <p className="text-gray-600">
            Nie masz jeszcze żadnych nieruchomości. Dodaj pierwszą, aby
            rozpocząć.
          </p>
        </div>
      </div>
    );
  }

  const currentProperty = properties[propertyIdx];
  const tenant = currentProperty.tenant;
  const payment = currentProperty.currentPayment;
  const documents = currentProperty.documents;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Header with user info and logout */}
      <div className="max-w-5xl mx-auto mb-6 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Zalogowany jako:{' '}
          <span className="font-medium">{session?.user?.name}</span>
        </div>
        <LogoutButton />
      </div>

      {/* Context Switcher */}
      <div className="flex items-center justify-center mb-8">
        {properties.length > 1 && (
          <button
            onClick={prevProperty}
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
          {currentProperty.address}
        </div>
        {properties.length > 1 && (
          <button
            onClick={nextProperty}
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

      {/* Property counter */}
      {properties.length > 1 && (
        <div className="text-center text-sm text-gray-500 mb-4">
          Nieruchomość {propertyIdx + 1} z {properties.length}
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* Najemca Card */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
          <h2 className="text-gray-700 font-semibold text-lg mb-4">Najemca</h2>
          {tenant ? (
            <div className="flex items-center">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700 mr-4">
                {getInitials(tenant.name)}
              </div>
              <div>
                <div className="text-gray-800 font-medium text-base">
                  {tenant.name}
                </div>
                <div className="flex space-x-2 mt-2">
                  {/* Phone */}
                  <a
                    href={`tel:${tenant.phone}`}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition"
                    aria-label="Zadzwoń"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 20 20"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.5 5.5A16 16 0 0014.5 17.5l2-2a2 2 0 00-2.3-3.3l-1.2.5a1 1 0 01-1.1-.2l-2.2-2.2a1 1 0 01-.2-1.1l.5-1.2A2 2 0 007.5 3.5l-2 2z"
                      />
                    </svg>
                  </a>
                  {/* Email */}
                  <a
                    href={`mailto:${tenant.email}`}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition"
                    aria-label="Wyślij email"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 20 20"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 7l7 5 7-5M5 5h10a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
                      />
                    </svg>
                  </a>
                  {/* Chat */}
                  <button
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition"
                    aria-label="Czat"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 20 20"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 8c0 3.866-3.582 7-8 7a8.96 8.96 0 01-4-.93L2 17l2.93-2A8.96 8.96 0 011 8c0-3.866 3.582-7 8-7s8 3.134 8 7z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-center py-4">
              <p>Brak aktywnego najemcy</p>
            </div>
          )}
        </div>

        {/* Bieżące Płatności Card */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
          <h2 className="text-gray-700 font-semibold text-lg mb-4">
            Bieżące Płatności
          </h2>
          {payment ? (
            <>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-gray-500 text-sm">Termin płatności</div>
                  <div className="text-gray-800 font-medium text-base">
                    {formatDate(payment.dueDate)}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatAmount(payment.amountDue)} zł
                </div>
              </div>
              {payment.amountPaid !== null && payment.amountPaid > 0 && (
                <div className="text-sm text-gray-600 mb-2">
                  Opłacono: {formatAmount(payment.amountPaid)} zł
                </div>
              )}
              <div className="mt-4">
                {getPaymentStatusBadge(payment.status)}
              </div>
            </>
          ) : (
            <div className="text-gray-500 text-center py-4">
              <p>Brak płatności w tym miesiącu</p>
            </div>
          )}
        </div>

        {/* Dokumenty Card */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
          <h2 className="text-gray-700 font-semibold text-lg mb-4">
            Dokumenty
          </h2>
          {documents.length > 0 ? (
            <ul className="space-y-3">
              {documents.map(doc => (
                <li key={doc.id} className="flex items-center">
                  {getDocumentStatusIcon(doc.type, doc.expiresAt)}
                  <span className="ml-3 text-gray-800">
                    {getDocumentLabel(doc.type)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-500 text-center py-4">
              <p>Brak dokumentów</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
