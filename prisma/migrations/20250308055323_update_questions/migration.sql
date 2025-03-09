/*
  Warnings:

  - You are about to drop the column `question` on the `Questions` table. All the data in the column will be lost.
  - Added the required column `status` to the `Questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `Questions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Questions" DROP COLUMN "question",
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "text" TEXT NOT NULL;
