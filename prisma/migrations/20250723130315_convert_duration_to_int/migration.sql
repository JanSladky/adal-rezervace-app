/*
  Warnings:

  - Changed the type of `duration` on the `Event` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Event"
ALTER COLUMN "duration" TYPE INTEGER USING "duration"::integer;
