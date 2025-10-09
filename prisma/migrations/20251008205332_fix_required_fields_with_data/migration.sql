/*
  Warnings:

  - Added the required column `ownerId` to the `Lease` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable - Add ownerId to Lease with default value
ALTER TABLE "Lease" ADD COLUMN "ownerId" TEXT;

-- Update existing Lease records - set ownerId to first User with OWNER role
UPDATE "Lease" SET "ownerId" = (SELECT id FROM "User" WHERE role = 'OWNER' LIMIT 1);

-- Make ownerId NOT NULL after updating existing data
ALTER TABLE "Lease" ALTER COLUMN "ownerId" SET NOT NULL;

-- AlterTable - Add name and phone to User with default values
ALTER TABLE "User" ADD COLUMN "name" TEXT,
ADD COLUMN "phone" TEXT,
ALTER COLUMN "role" SET DEFAULT 'OWNER';

-- Update existing User records with default values
UPDATE "User" SET 
  "name" = COALESCE("name", 'Użytkownik ' || SUBSTRING(id, 1, 8)),
  "phone" = COALESCE("phone", '+48 000 000 000');

-- Make name and phone NOT NULL after updating existing data
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "phone" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Lease" ADD CONSTRAINT "Lease_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
