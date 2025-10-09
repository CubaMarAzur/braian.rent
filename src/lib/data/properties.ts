/**
 * Data access layer for properties
 * Server-side only functions for fetching property data
 */

import { PrismaClient } from '@prisma/client';
import { cache } from 'react';
import type { PropertyWithDetails } from '@/types/property';

const prisma = new PrismaClient();

/**
 * Fetches all properties for a specific owner
 * Uses React cache() for request deduplication
 *
 * @param ownerId - The ID of the property owner
 * @returns Array of properties with tenant, payment, and document details
 */
export const getPropertiesByOwner = cache(
  async (ownerId: string): Promise<PropertyWithDetails[]> => {
    const properties = await prisma.property.findMany({
      where: {
        ownerId,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        leases: {
          where: {
            startDate: { lte: new Date() },
            endDate: { gte: new Date() },
          },
          include: {
            tenant: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
            payments: {
              where: {
                dueDate: {
                  gte: new Date(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    1
                  ),
                  lte: new Date(
                    new Date().getFullYear(),
                    new Date().getMonth() + 1,
                    0
                  ),
                },
              },
              orderBy: {
                dueDate: 'desc',
              },
              take: 1,
            },
          },
          orderBy: {
            startDate: 'desc',
          },
          take: 1,
        },
        documents: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform Prisma data to frontend format
    return properties.map(property => {
      const activeLease = property.leases[0];
      const currentPayment = activeLease?.payments[0];

      return {
        id: property.id,
        address: property.address,
        city: property.city,
        postalCode: property.postalCode,
        tenant: activeLease
          ? {
              id: activeLease.tenant.id,
              name: activeLease.tenant.name,
              email: activeLease.tenant.email,
              phone: activeLease.tenant.phone,
            }
          : null,
        currentPayment: currentPayment
          ? {
              id: currentPayment.id,
              amountDue: Number(currentPayment.amountDue),
              amountPaid: currentPayment.amountPaid
                ? Number(currentPayment.amountPaid)
                : null,
              dueDate: currentPayment.dueDate.toISOString(),
              status: currentPayment.status,
              type: currentPayment.type,
              description: currentPayment.description,
            }
          : null,
        documents: property.documents.map(doc => ({
          id: doc.id,
          type: doc.type,
          fileUrl: doc.fileUrl,
          expiresAt: doc.expiresAt ? doc.expiresAt.toISOString() : null,
          createdAt: doc.createdAt.toISOString(),
        })),
      };
    });
  }
);

/**
 * Fetches a single property by ID, ensuring ownership
 *
 * @param propertyId - The property ID
 * @param ownerId - The owner ID (for authorization)
 * @returns Property details or null if not found/unauthorized
 */
export const getPropertyById = cache(
  async (
    propertyId: string,
    ownerId: string
  ): Promise<PropertyWithDetails | null> => {
    const properties = await getPropertiesByOwner(ownerId);
    return properties.find(p => p.id === propertyId) || null;
  }
);
