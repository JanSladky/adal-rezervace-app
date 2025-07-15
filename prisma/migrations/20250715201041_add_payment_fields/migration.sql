/*
  Warnings:

  - Made the column `email` on table `Registration` required. This step will fail if there are existing NULL values in that column.
  - Made the column `eventDateId` on table `Registration` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Registration` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Registration" DROP CONSTRAINT "Registration_eventDateId_fkey";

-- AlterTable
ALTER TABLE "Event"
ADD COLUMN "amountCZK" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "variableSymbol" TEXT NOT NULL DEFAULT '0000',
ADD COLUMN "accountNumber" TEXT NOT NULL DEFAULT '000000';

ALTER TABLE "Registration"
ALTER COLUMN "name" SET DEFAULT 'Neuvedeno',
ALTER COLUMN "email" SET DEFAULT 'neuvedeno@priklad.cz',
ALTER COLUMN "attendees" SET DEFAULT 1;

UPDATE "Registration" SET "name" = 'Neuvedeno' WHERE "name" IS NULL;
UPDATE "Registration" SET "email" = 'neuvedeno@priklad.cz' WHERE "email" IS NULL;
UPDATE "Registration" SET "attendees" = 1 WHERE "attendees" IS NULL;
