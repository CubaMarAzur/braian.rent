import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/lib/auth';
import { appLogger } from '@/lib/logger';
import type { PropertyWithDetails } from '@/types/property';

const prisma = new PrismaClient();

export async function GET() {
  const startTime = Date.now();

  try {
    // Check authentication
    const session = await auth();

    if (!session || !session.user?.id) {
      appLogger.warn('Unauthorized access to properties endpoint');
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch properties owned by the authenticated user
    const properties = await prisma.property.findMany({
      where: {
        ownerId: session.user.id,
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

    // Transform data to match frontend interface
    const transformedProperties: PropertyWithDetails[] = properties.map(
      property => {
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
      }
    );

    const responseTime = Date.now() - startTime;

    appLogger.info('Properties fetched successfully', {
      userId: session.user.id,
      count: transformedProperties.length,
      responseTime: `${responseTime}ms`,
    });

    return NextResponse.json(
      {
        success: true,
        data: transformedProperties,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    appLogger.error('Failed to fetch properties', {
      error: errorMessage,
      responseTime: `${Date.now() - startTime}ms`,
    });

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch properties',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
