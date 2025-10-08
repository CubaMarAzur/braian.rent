# Model Danych - Braian.rent MVP Slim

# Wersja 1.1 (Udoskonalona)

Ten dokument definiuje schemat bazy danych PostgreSQL dla aplikacji Braian.rent, używając składni Prisma Schema Language (PSL).

## 1. Schemat Prisma

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: [https://pris.ly/d/prisma-schema](https://pris.ly/d/prisma-schema)

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ===================================
// ENUMS - Definicje typów wyliczeniowych
// ===================================

enum Role {
  OWNER
  TENANT
}

enum PaymentStatus {
  UNPAID
  PARTIALLY_PAID
  PAID
}

// POPRAWKA: Dodano typ płatności dla lepszej struktury
enum PaymentType {
  RENT      // Czynsz najmu
  ADMIN_FEE // Czynsz administracyjny
  UTILITIES // Media
  DEPOSIT   // Kaucja
  OTHER     // Inne
}

enum DocumentType {
  LEASE_AGREEMENT // Umowa najmu
  INSURANCE       // Ubezpieczenie
  HANDOVER_PROTOCOL // Protokół zdawczo-odbiorczy
}


// ===================================
// MODELS - Definicje tabel w bazie danych
// ===================================

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  role Role @default(TENANT)

  // Relacje
  ownedProperties Property[] @relation("OwnerProperties")
  leasesAsTenant  Lease[]    @relation("TenantLeases")

  chatThreadsAsOwner  ChatThread[] @relation("OwnerChatThreads")
  chatThreadsAsTenant ChatThread[] @relation("TenantChatThreads")
}

model Property {
  id        String   @id @default(cuid())
  address   String
  city      String
  postalCode String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relacje
  owner    User     @relation("OwnerProperties", fields: [ownerId], references: [id])
  ownerId  String

  leases    Lease[]
  documents Document[]
  chatThreads ChatThread[]
}

model Lease {
  id        String   @id @default(cuid())
  startDate DateTime
  endDate   DateTime
  rentAmount Decimal
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relacje
  property    Property @relation(fields: [propertyId], references: [id])
  propertyId  String

  tenant      User     @relation("TenantLeases", fields: [tenantId], references: [id])
  tenantId    String

  payments    Payment[]
  documents   Document[] // POPRAWKA: Umowa najmu (dokument) jest teraz powiązana bezpośrednio z Lease
}

model Payment {
  id        String   @id @default(cuid())
  amountDue Decimal
  amountPaid Decimal?
  dueDate   DateTime

  status    PaymentStatus @default(UNPAID)
  type      PaymentType   @default(RENT) // POPRAWKA: Dodano typ płatności

  // Opis jest teraz opcjonalny, jeśli typ "OTHER"
  description String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relacje
  lease    Lease  @relation(fields: [leaseId], references: [id])
  leaseId  String
}

model Document {
  id        String   @id @default(cuid())
  fileUrl   String
  type      DocumentType
  expiresAt DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relacje
  property    Property @relation(fields: [propertyId], references: [id])
  propertyId  String

  // POPRAWKA: Dokument może być teraz bezpośrednio powiązany z umową najmu (Lease)
  lease       Lease?   @relation(fields: [leaseId], references: [id])
  leaseId     String?
}

model ChatThread {
  id        String   @id @default(cuid())
  firestoreThreadId String @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relacje
  property    Property @relation(fields: [propertyId], references: [id])
  propertyId  String

  owner       User     @relation("OwnerChatThreads", fields: [ownerId], references: [id])
  ownerId     String

  tenant      User     @relation("TenantChatThreads", fields: [tenantId], references: [id])
  tenantId    String
}
```
