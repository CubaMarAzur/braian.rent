/**
 * Documents list card
 * Server Component - displays document status
 */

import type { PropertyDocument, DocumentType } from '@/types/property';

interface DocumentsCardProps {
  documents: PropertyDocument[];
}

/**
 * Translates document type enum to Polish label
 * @param type - Document type enum
 * @returns Translated label
 */
function getDocumentLabel(type: DocumentType): string {
  const labels: Record<DocumentType, string> = {
    LEASE_AGREEMENT: 'Umowa Najmu',
    INSURANCE: 'Ubezpieczenie OC',
    HANDOVER_PROTOCOL: 'Protokół Zdawczo-Odbiorczy',
    OTHER: 'Inny dokument',
  };
  return labels[type] || type;
}

/**
 * Returns status icon based on document type and expiration
 * @param docType - Document type
 * @param expiresAt - Expiration date (ISO string) or null
 * @returns JSX element with appropriate status icon
 */
function getDocumentStatusIcon(
  docType: DocumentType,
  expiresAt: string | null
) {
  const isExpiringSoon =
    expiresAt &&
    new Date(expiresAt) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const isExpired = expiresAt && new Date(expiresAt) < new Date();

  // Red icon for expired/warning documents
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

  // Yellow icon for expiring soon
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

  // Green icon for valid documents
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

export default function DocumentsCard({ documents }: DocumentsCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col h-full">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
          <svg
            className="w-5 h-5 text-purple-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h2 className="text-gray-800 font-bold text-xl">Dokumenty</h2>
      </div>
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
  );
}
