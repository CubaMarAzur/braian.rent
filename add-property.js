import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addProperty() {
  try {
    // Znajdź użytkownika jacob@heavenbroker.pl
    const user = await prisma.user.findUnique({
      where: { email: 'jacob@heavenbroker.pl' },
    });

    if (!user) {
      console.log('❌ Użytkownik jacob@heavenbroker.pl nie został znaleziony');
      return;
    }

    console.log('✅ Znaleziono użytkownika:', user.name, user.email);

    // Dodaj nieruchomość
    const property = await prisma.property.create({
      data: {
        address: 'ul. Przykładowa 123/45',
        city: 'Warszawa',
        postalCode: '00-001',
        ownerId: user.id,
      },
    });

    console.log('✅ Dodano nieruchomość:', property.address, property.id);

    // Dodaj najemcę
    const tenant = await prisma.user.create({
      data: {
        email: 'jan.nowak@example.com',
        password: '$2a$10$dummy.hash.for.testing',
        role: 'TENANT',
        name: 'Jan Nowak',
        phone: '+48 555 123 456',
      },
    });

    console.log('✅ Dodano najemcę:', tenant.name, tenant.email);

    // Dodaj umowę najmu
    const lease = await prisma.lease.create({
      data: {
        propertyId: property.id,
        ownerId: user.id,
        tenantId: tenant.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2025-12-31'),
        rentAmount: 3000,
      },
    });

    console.log('✅ Dodano umowę najmu:', lease.id);

    // Dodaj płatność
    const payment = await prisma.payment.create({
      data: {
        leaseId: lease.id,
        amountDue: 3000,
        dueDate: new Date('2024-11-01'),
        type: 'RENT',
        status: 'UNPAID',
        description: 'Czynsz za listopad 2024',
      },
    });

    console.log('✅ Dodano płatność:', payment.id);

    console.log('🎉 Wszystko dodane pomyślnie!');
    console.log('📍 Adres nieruchomości:', property.address);
    console.log('👤 Najemca:', tenant.name);
    console.log('💰 Kwota czynszu:', lease.rentAmount, 'zł');
  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addProperty();
