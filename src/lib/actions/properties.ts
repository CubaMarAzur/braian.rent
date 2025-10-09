/**
 * Server Actions for property management
 * These functions run on the server and can be called directly from Client Components
 */

'use server';

import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const createPropertySchema = z.object({
  address: z.string().min(5, 'Adres musi mieć minimum 5 znaków'),
  city: z.string().min(2, 'Miasto musi mieć minimum 2 znaki'),
  postalCode: z
    .string()
    .regex(/^\d{2}-\d{3}$/, 'Nieprawidłowy kod pocztowy (format: XX-XXX)'),
});

const updatePropertySchema = createPropertySchema.partial().extend({
  propertyId: z.string(),
});

/**
 * Creates a new property for the authenticated user
 *
 * @param formData - Form data containing address, city, postalCode
 * @returns Result object with success status and data or error message
 */
export async function createProperty(formData: FormData) {
  try {
    // Check authentication
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Musisz być zalogowany, aby dodać nieruchomość',
      };
    }

    // Parse and validate form data
    const rawData = {
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      postalCode: formData.get('postalCode') as string,
    };

    const validation = createPropertySchema.safeParse(rawData);

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0].message,
      };
    }

    // Create property
    const property = await prisma.property.create({
      data: {
        ...validation.data,
        ownerId: session.user.id,
      },
    });

    // Revalidate dashboard to show new property
    revalidatePath('/');

    return {
      success: true,
      data: {
        id: property.id,
        address: property.address,
        city: property.city,
        postalCode: property.postalCode,
      },
    };
  } catch (error) {
    console.error('[Server Action] Create property error:', error);
    return {
      success: false,
      error: 'Nie udało się dodać nieruchomości',
    };
  }
}

/**
 * Updates an existing property
 * Verifies ownership before allowing update
 *
 * @param formData - Form data with propertyId and fields to update
 * @returns Result object with success status and data or error message
 */
export async function updateProperty(formData: FormData) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Musisz być zalogowany',
      };
    }

    const rawData = {
      propertyId: formData.get('propertyId') as string,
      address: formData.get('address') as string | undefined,
      city: formData.get('city') as string | undefined,
      postalCode: formData.get('postalCode') as string | undefined,
    };

    const validation = updatePropertySchema.safeParse(rawData);

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0].message,
      };
    }

    // Verify ownership
    const existingProperty = await prisma.property.findFirst({
      where: {
        id: validation.data.propertyId,
        ownerId: session.user.id,
      },
    });

    if (!existingProperty) {
      return {
        success: false,
        error:
          'Nieruchomość nie została znaleziona lub nie masz do niej dostępu',
      };
    }

    // Update property
    const { propertyId, ...updateData } = validation.data;
    const updated = await prisma.property.update({
      where: { id: propertyId },
      data: updateData,
    });

    revalidatePath('/');

    return {
      success: true,
      data: {
        id: updated.id,
        address: updated.address,
        city: updated.city,
        postalCode: updated.postalCode,
      },
    };
  } catch (error) {
    console.error('[Server Action] Update property error:', error);
    return {
      success: false,
      error: 'Nie udało się zaktualizować nieruchomości',
    };
  }
}

/**
 * Deletes a property
 * Verifies ownership and checks for active leases before deletion
 *
 * @param propertyId - ID of the property to delete
 * @returns Result object with success status or error message
 */
export async function deleteProperty(propertyId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Musisz być zalogowany',
      };
    }

    // Verify ownership and check for active leases
    const property = await prisma.property.findFirst({
      where: {
        id: propertyId,
        ownerId: session.user.id,
      },
      include: {
        leases: {
          where: {
            endDate: { gte: new Date() },
          },
        },
      },
    });

    if (!property) {
      return {
        success: false,
        error: 'Nieruchomość nie została znaleziona',
      };
    }

    if (property.leases.length > 0) {
      return {
        success: false,
        error: 'Nie można usunąć nieruchomości z aktywnymi umowami najmu',
      };
    }

    // Delete property
    await prisma.property.delete({
      where: { id: propertyId },
    });

    revalidatePath('/');

    return {
      success: true,
      message: 'Nieruchomość została usunięta',
    };
  } catch (error) {
    console.error('[Server Action] Delete property error:', error);
    return {
      success: false,
      error: 'Nie udało się usunąć nieruchomości',
    };
  }
}
