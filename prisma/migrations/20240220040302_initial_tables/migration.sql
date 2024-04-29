/*
  Warnings:

  - You are about to drop the `ToDo` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `displayName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'VENDOR');

-- DropForeignKey
ALTER TABLE "ToDo" DROP CONSTRAINT "ToDo_ownerId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "displayName" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "role" "UserRole" NOT NULL;

-- DropTable
DROP TABLE "ToDo";

-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "price" INTEGER NOT NULL,
    "customerID" INTEGER NOT NULL,
    "serviceID" INTEGER NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dismissed" BOOLEAN NOT NULL,
    "start" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bookingID" INTEGER NOT NULL,
    "userID" INTEGER NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "stars" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorID" INTEGER NOT NULL,
    "serviceID" INTEGER NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" SERIAL NOT NULL,
    "minPrice" INTEGER NOT NULL,
    "maxPrice" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "range" INTEGER NOT NULL,
    "vendorID" INTEGER NOT NULL,
    "typeID" INTEGER NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "typeID" INTEGER NOT NULL,

    CONSTRAINT "SubType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubTypeService" (
    "id" SERIAL NOT NULL,
    "subTypeID" INTEGER NOT NULL,
    "serviceID" INTEGER NOT NULL,

    CONSTRAINT "SubTypeService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_userFavorites" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Notification_bookingID_key" ON "Notification"("bookingID");

-- CreateIndex
CREATE UNIQUE INDEX "_userFavorites_AB_unique" ON "_userFavorites"("A", "B");

-- CreateIndex
CREATE INDEX "_userFavorites_B_index" ON "_userFavorites"("B");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_customerID_fkey" FOREIGN KEY ("customerID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_serviceID_fkey" FOREIGN KEY ("serviceID") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_bookingID_fkey" FOREIGN KEY ("bookingID") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_authorID_fkey" FOREIGN KEY ("authorID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_serviceID_fkey" FOREIGN KEY ("serviceID") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_vendorID_fkey" FOREIGN KEY ("vendorID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_typeID_fkey" FOREIGN KEY ("typeID") REFERENCES "Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubType" ADD CONSTRAINT "SubType_typeID_fkey" FOREIGN KEY ("typeID") REFERENCES "Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubTypeService" ADD CONSTRAINT "SubTypeService_subTypeID_fkey" FOREIGN KEY ("subTypeID") REFERENCES "SubType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubTypeService" ADD CONSTRAINT "SubTypeService_serviceID_fkey" FOREIGN KEY ("serviceID") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_userFavorites" ADD CONSTRAINT "_userFavorites_A_fkey" FOREIGN KEY ("A") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_userFavorites" ADD CONSTRAINT "_userFavorites_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
