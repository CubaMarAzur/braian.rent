/**
 * Unit tests for TenantCard component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TenantCard from '../TenantCard';
import type { TenantInfo } from '@/types/property';

describe('TenantCard', () => {
  it('renders tenant information correctly', () => {
    const mockTenant: TenantInfo = {
      id: 'tenant-123',
      name: 'Jan Kowalski',
      email: 'jan@example.com',
      phone: '+48 123 456 789',
    };

    render(<TenantCard tenant={mockTenant} />);

    // Check if name is displayed
    expect(screen.getByText('Jan Kowalski')).toBeInTheDocument();

    // Check if initials are correct
    expect(screen.getByText('JK')).toBeInTheDocument();

    // Check if contact buttons are present
    const phoneLink = screen.getByLabelText('Zadzwoń');
    expect(phoneLink).toHaveAttribute('href', 'tel:+48 123 456 789');

    const emailLink = screen.getByLabelText('Wyślij email');
    expect(emailLink).toHaveAttribute('href', 'mailto:jan@example.com');
  });

  it('renders empty state when no tenant', () => {
    render(<TenantCard tenant={null} />);

    expect(screen.getByText('Brak aktywnego najemcy')).toBeInTheDocument();
  });

  it('generates correct initials from name', () => {
    const mockTenant: TenantInfo = {
      id: 'tenant-123',
      name: 'Anna Maria Nowak',
      email: 'anna@example.com',
      phone: '+48 987 654 321',
    };

    render(<TenantCard tenant={mockTenant} />);

    // Should use first and second name
    expect(screen.getByText('AM')).toBeInTheDocument();
  });

  it('handles single-word names for initials', () => {
    const mockTenant: TenantInfo = {
      id: 'tenant-123',
      name: 'Madonna',
      email: 'madonna@example.com',
      phone: '+48 111 222 333',
    };

    render(<TenantCard tenant={mockTenant} />);

    // Should use first two letters
    expect(screen.getByText('MA')).toBeInTheDocument();
  });
});
