/**
 * Unit tests for PaymentCard component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PaymentCard from '../PaymentCard';
import type { CurrentPayment } from '@/types/property';

describe('PaymentCard', () => {
  it('renders payment information correctly', () => {
    const mockPayment: CurrentPayment = {
      id: 'test-payment-id',
      amountDue: 2500,
      amountPaid: null,
      dueDate: '2025-10-10T00:00:00.000Z',
      status: 'UNPAID',
      type: 'RENT',
      description: null,
    };

    render(<PaymentCard payment={mockPayment} />);

    // Check if payment amount is displayed
    expect(screen.getByText(/2.*500 zł/)).toBeInTheDocument();

    // Check if status badge is displayed
    expect(screen.getByText('Nieopłacona')).toBeInTheDocument();

    // Check if due date is displayed
    expect(screen.getByText('Termin płatności')).toBeInTheDocument();
  });

  it('renders empty state when no payment', () => {
    render(<PaymentCard payment={null} />);

    expect(
      screen.getByText('Brak płatności w tym miesiącu')
    ).toBeInTheDocument();
  });

  it('shows partially paid status correctly', () => {
    const mockPayment: CurrentPayment = {
      id: 'test-payment-id',
      amountDue: 2500,
      amountPaid: 1000,
      dueDate: '2025-10-10T00:00:00.000Z',
      status: 'PARTIALLY_PAID',
      type: 'RENT',
      description: null,
    };

    render(<PaymentCard payment={mockPayment} />);

    expect(screen.getByText(/Opłacono:/)).toBeInTheDocument();
    expect(screen.getByText(/1.*000 zł/)).toBeInTheDocument();
    expect(screen.getByText('Częściowo opłacona')).toBeInTheDocument();
  });

  it('shows paid status correctly', () => {
    const mockPayment: CurrentPayment = {
      id: 'test-payment-id',
      amountDue: 2500,
      amountPaid: 2500,
      dueDate: '2025-10-10T00:00:00.000Z',
      status: 'PAID',
      type: 'RENT',
      description: null,
    };

    render(<PaymentCard payment={mockPayment} />);

    expect(screen.getByText('Opłacona')).toBeInTheDocument();
  });
});
