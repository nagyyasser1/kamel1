/*
  Warnings:

  - You are about to drop the column `code` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Account` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Account_email_key";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "code",
DROP COLUMN "status",
DROP COLUMN "type",
ADD COLUMN     "number" INTEGER,
ALTER COLUMN "email" DROP NOT NULL;

-- DropEnum
DROP TYPE "AccountType";

-- CreateIndex
CREATE UNIQUE INDEX "Account_name_key" ON "Account"("name");
