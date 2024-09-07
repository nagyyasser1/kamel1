/*
  Warnings:

  - You are about to alter the column `number` on the `Account` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `number` on the `Category` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `number` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "number" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "number" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "number" SET DATA TYPE INTEGER;
