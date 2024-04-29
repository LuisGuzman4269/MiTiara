/*
  Warnings:

  - Added the required column `status` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "status" BOOLEAN NOT NULL;
