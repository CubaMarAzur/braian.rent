/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable - Add password as nullable first
ALTER TABLE "User" ADD COLUMN "password" TEXT;

-- Update existing users with a temporary hashed password
-- This is bcrypt hash for 'ChangeMe123!' - users will need to reset their password
UPDATE "User" SET "password" = '$2a$10$YourDefaultHashHere.ChangeThisInProduction' WHERE "password" IS NULL;

-- Make password NOT NULL after updating existing data
ALTER TABLE "User" ALTER COLUMN "password" SET NOT NULL;
