/**
 * Payment information card
 * Server Component - pure display logic
 */

import type { CurrentPayment, PaymentStatus } from '@/types/property';

interface PaymentCardProps {
  payment: CurrentPayment | null;
}

/**
 * Formats a date string to Polish locale format
 * @param dateString - ISO date string
 * @returns Formatted date (DD.MM.YYYY)
 */
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Formats a number as Polish currency
 * @param amount - Amount in PLN
 * @returns Formatted amount (e.g., "2 500")
 */
function formatAmount(amount: number): string {
  return new Intl.NumberFormat('pl-PL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Returns appropriate status badge for payment status
 * @param status - Payment status enum
 * @returns JSX element with styled badge
 */
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

export default function PaymentCard({ payment }: PaymentCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col h-full">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
          <svg
            className="w-5 h-5 text-yellow-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
        </div>
        <h2 className="text-gray-800 font-bold text-xl">Bieżące Płatności</h2>
      </div>
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
          <div className="mt-4">{getPaymentStatusBadge(payment.status)}</div>
        </>
      ) : (
        <div className="text-gray-500 text-center py-4">
          <p>Brak płatności w tym miesiącu</p>
        </div>
      )}
    </div>
  );
}
