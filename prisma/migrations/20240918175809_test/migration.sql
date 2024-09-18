/*
  Warnings:

  - You are about to drop the column `productId` on the `ProductTransaction` table. All the data in the column will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `accountId` to the `ProductTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductTransaction" DROP CONSTRAINT "ProductTransaction_productId_fkey";

-- AlterTable
ALTER TABLE "ProductTransaction" DROP COLUMN "productId",
ADD COLUMN     "accountId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Product";

-- AddForeignKey
ALTER TABLE "ProductTransaction" ADD CONSTRAINT "ProductTransaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
