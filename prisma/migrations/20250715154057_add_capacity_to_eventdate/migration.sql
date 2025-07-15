/*
  Warnings:

  - Added the required column `capacity` to the `EventDate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventDate" ADD COLUMN     "capacity" INTEGER NOT NULL;
