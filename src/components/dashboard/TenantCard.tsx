/**
 * Tenant information card
 * Server Component - no interactivity needed
 */

import type { TenantInfo } from '@/types/property';

interface TenantCardProps {
  tenant: TenantInfo | null;
}

/**
 * Generates initials from a full name
 * @param name - Full name (e.g., "Jan Kowalski")
 * @returns Initials (e.g., "JK")
 */
function getInitials(name: string): string {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

export default function TenantCard({ tenant }: TenantCardProps) {
  return (
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
  );
}
