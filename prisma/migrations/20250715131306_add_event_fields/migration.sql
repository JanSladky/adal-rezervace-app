-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('nenarocne', 'stredne_narocne', 'narocne');

-- AlterTable
ALTER TABLE "Event" 
ADD COLUMN "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN "difficulty" "Difficulty" NOT NULL DEFAULT 'nenarocne',
ADD COLUMN "image" TEXT NOT NULL DEFAULT '',
ADD COLUMN "location" TEXT NOT NULL DEFAULT '';