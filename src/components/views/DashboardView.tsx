'use client';

import React, { useState } from 'react';

const properties = [
  { address: 'ul. Poznańska 12/3, Warszawa' },
  { address: 'ul. Marszałkowska 45, Warszawa' },
  { address: 'ul. Długa 7, Kraków' },
];

const documents = [
  {
    name: 'Umowa Najmu',
    status: 'done',
  },
  {
    name: 'Ubezpieczenie OC',
    status: 'warning',
  },
  {
    name: 'Protokół Zdawczo-Odbiorczy',
    status: 'warning',
  },
];

function getStatusIcon(status: string) {
  if (status === 'done') {
    return (
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600">
        {/* Checkmark SVG */}
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
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-600">
      {/* Warning SVG */}
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

const DashboardView: React.FC = () => {
  const [propertyIdx, setPropertyIdx] = useState(0);

  const prevProperty = () => {
    setPropertyIdx(idx => (idx === 0 ? properties.length - 1 : idx - 1));
  };

  const nextProperty = () => {
    setPropertyIdx(idx => (idx === properties.length - 1 ? 0 : idx + 1));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Context Switcher */}
      <div className="flex items-center justify-center mb-8">
        <button
          onClick={prevProperty}
          className="p-2 rounded-full hover:bg-gray-200 transition"
          aria-label="Poprzednia nieruchomość"
        >
          {/* Left Arrow */}
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
        <div className="mx-4 px-6 py-3 bg-white rounded-xl shadow text-lg font-medium text-gray-800 min-w-[260px] text-center">
          {properties[propertyIdx].address}
        </div>
        <button
          onClick={nextProperty}
          className="p-2 rounded-full hover:bg-gray-200 transition"
          aria-label="Następna nieruchomość"
        >
          {/* Right Arrow */}
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
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* Najemca Card */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
          <h2 className="text-gray-700 font-semibold text-lg mb-4">Najemca</h2>
          <div className="flex items-center">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700 mr-4">
              AN
            </div>
            <div>
              <div className="text-gray-800 font-medium text-base">
                Anna Nowak
              </div>
              <div className="flex space-x-2 mt-2">
                {/* Phone */}
                <button
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
                </button>
                {/* Email */}
                <button
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
                </button>
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
        </div>

        {/* Bieżące Płatności Card */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
          <h2 className="text-gray-700 font-semibold text-lg mb-4">
            Bieżące Płatności
          </h2>
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-gray-500 text-sm">Termin płatności</div>
              <div className="text-gray-800 font-medium text-base">
                10.10.2025
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">2500 zł</div>
          </div>
          <div className="mt-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
              {/* Warning icon */}
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
              Nieopłacona
            </span>
          </div>
        </div>

        {/* Dokumenty Card */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
          <h2 className="text-gray-700 font-semibold text-lg mb-4">
            Dokumenty
          </h2>
          <ul className="space-y-3">
            {documents.map(doc => (
              <li key={doc.name} className="flex items-center">
                {getStatusIcon(doc.status)}
                <span className="ml-3 text-gray-800">{doc.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
