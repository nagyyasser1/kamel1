/*
  Warnings:

  - You are about to drop the column `accountId` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `accountId` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `accountId` on the `Supplier` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[assetId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clientId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[supplierId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Asset" DROP CONSTRAINT "Asset_accountId_fkey";

-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_accountId_fkey";

-- DropForeignKey
ALTER TABLE "Supplier" DROP CONSTRAINT "Supplier_accountId_fkey";

-- DropIndex
DROP INDEX "Asset_accountId_key";

-- DropIndex
DROP INDEX "Client_accountId_key";

-- DropIndex
DROP INDEX "Supplier_accountId_key";

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "assetId" TEXT,
ADD COLUMN     "clientId" TEXT,
ADD COLUMN     "supplierId" TEXT;

-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "accountId";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "accountId";

-- AlterTable
ALTER TABLE "Supplier" DROP COLUMN "accountId";

-- CreateIndex
CREATE UNIQUE INDEX "Account_assetId_key" ON "Account"("assetId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_clientId_key" ON "Account"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_supplierId_key" ON "Account"("supplierId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
