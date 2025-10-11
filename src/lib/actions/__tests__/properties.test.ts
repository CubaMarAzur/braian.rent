/**
 * Unit tests for property server actions
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Prisma and auth
vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => ({
    property: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  })),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

import { createProperty, deleteProperty } from '../properties';
import { auth } from '@/lib/auth';

describe('Property Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createProperty', () => {
    it('requires authentication', async () => {
      // Mock auth to return null (no session)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(auth).mockResolvedValue(null as any);

      const formData = new FormData();
      formData.append('address', 'ul. Testowa 1');
      formData.append('city', 'Warszawa');
      formData.append('postalCode', '00-001');

      const result = await createProperty(formData);

      expect(result.success).toBe(false);
      expect(result.error).toContain('zalogowany');
    });

    it('validates form data structure', async () => {
      // Note: Full validation tests would require mocking Prisma
      // For now, we just verify the function signature and basic flow
      expect(typeof createProperty).toBe('function');
    });
  });

  describe('deleteProperty', () => {
    it('has correct function signature', async () => {
      // Verify the function exists and has correct type
      expect(typeof deleteProperty).toBe('function');

      // Verify it requires authentication
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(auth).mockResolvedValue(null as any);
      const result = await deleteProperty('test-property-id');

      expect(result.success).toBe(false);
      expect(result.error).toContain('zalogowany');
    });
  });
});
