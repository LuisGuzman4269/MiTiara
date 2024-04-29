-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_serviceID_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_bookingID_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_serviceID_fkey";

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_serviceID_fkey" FOREIGN KEY ("serviceID") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_bookingID_fkey" FOREIGN KEY ("bookingID") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_serviceID_fkey" FOREIGN KEY ("serviceID") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
