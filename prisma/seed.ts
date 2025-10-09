// Importujemy klienta Prisma
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Inicjalizujemy klienta Prisma
const prisma = new PrismaClient();

// Główna funkcja, która wykona całą pracę
async function main() {
  console.log('🌱 Seeding the database...');

  // 1. Czyszczenie bazy danych
  console.log('🧹 Clearing existing data...');
  await prisma.payment.deleteMany();
  await prisma.document.deleteMany();
  await prisma.chatThread.deleteMany();
  await prisma.lease.deleteMany();
  await prisma.property.deleteMany();
  await prisma.user.deleteMany();
  console.log('🗑️ Existing data cleared.');

  // 2. Tworzenie testowych użytkowników
  console.log('👤 Creating test users...');

  // Hash test passwords
  const hashedPassword = await bcrypt.hash('TestPassword123!', 10);

  const ownerMarek = await prisma.user.create({
    data: {
      email: 'marek.wlasciciel@example.com',
      password: hashedPassword,
      role: 'OWNER',
      name: 'Marek Właściciel',
      phone: '+48 123 456 789',
    },
  });

  const tenantAnna = await prisma.user.create({
    data: {
      email: 'anna.najemca@example.com',
      password: hashedPassword,
      role: 'TENANT',
      name: 'Anna Najemca',
      phone: '+48 987 654 321',
    },
  });
  console.log(`👨‍💼 Created Owner 'Marek': ${ownerMarek.id}`);
  console.log(`👩‍💻 Created Tenant 'Anna': ${tenantAnna.id}`);

  // 3. Tworzenie nieruchomości dla Marka
  console.log('🏠 Creating property for Marek...');
  const propertyPoznanska = await prisma.property.create({
    data: {
      address: 'ul. Poznańska 12/3',
      city: 'Warszawa',
      postalCode: '00-680',
      ownerId: ownerMarek.id,
    },
  });
  console.log(`🏢 Created Property 'Poznańska': ${propertyPoznanska.id}`);

  // 4. Tworzenie umowy najmu (Lease)
  console.log('📄 Creating lease for Anna at Poznańska...');
  const lease = await prisma.lease.create({
    data: {
      propertyId: propertyPoznanska.id,
      ownerId: ownerMarek.id,
      tenantId: tenantAnna.id,
      startDate: new Date('2024-01-01T12:00:00Z'),
      endDate: new Date('2025-12-31T12:00:00Z'),
      rentAmount: 2500,
    },
  });
  console.log(`📝 Created Lease: ${lease.id}`);

  // 5. Tworzenie przykładowych dokumentów
  console.log('📂 Creating documents...');
  await prisma.document.create({
    data: {
      propertyId: propertyPoznanska.id,
      leaseId: lease.id,
      type: 'LEASE_AGREEMENT',
      fileUrl: 'https://example.com/umowa.pdf',
    },
  });

  // 6. Tworzenie przykładowej płatności
  console.log('💰 Creating payment...');
  await prisma.payment.create({
    data: {
      leaseId: lease.id,
      amountDue: 2500,
      dueDate: new Date('2025-10-10T12:00:00Z'),
      type: 'RENT',
      status: 'UNPAID',
    },
  });

  // 7. Tworzenie wątku czatu
  console.log('💬 Creating chat thread...');
  await prisma.chatThread.create({
    data: {
      propertyId: propertyPoznanska.id,
      ownerId: ownerMarek.id,
      tenantId: tenantAnna.id,
      firestoreThreadId: 'placeholder_firestore_id_123',
    },
  });

  console.log('✅ Seeding finished successfully!');
}

// Uruchomienie głównej funkcji
main()
  .catch(e => {
    console.error('❌ An error occurred while seeding the database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
