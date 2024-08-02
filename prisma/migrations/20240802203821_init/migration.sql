/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Account_number_key" ON "Account"("number");
