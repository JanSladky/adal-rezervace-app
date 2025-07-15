/*
  Warnings:

  - You are about to drop the column `date` on the `Event` table. All the data in the column will be lost.
  - Made the column `email` on table `Registration` required. This step will fail if there are existing NULL values in that column.
  - Made the column `eventDateId` on table `Registration` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Registration` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "date";

-- AlterTable
ALTER TABLE "Registration" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "eventDateId" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_eventDateId_fkey" FOREIGN KEY ("eventDateId") REFERENCES "EventDate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
