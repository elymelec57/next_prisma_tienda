-- AlterTable
ALTER TABLE "Pedido" ADD COLUMN     "direccion" TEXT;

-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "deliveryFreeRange" DOUBLE PRECISION,
ADD COLUMN     "deliveryLongPrice" DOUBLE PRECISION,
ADD COLUMN     "deliveryLongRange" DOUBLE PRECISION,
ADD COLUMN     "deliveryMediumPrice" DOUBLE PRECISION,
ADD COLUMN     "deliveryMediumRange" DOUBLE PRECISION,
ADD COLUMN     "deliveryShortPrice" DOUBLE PRECISION,
ADD COLUMN     "deliveryShortRange" DOUBLE PRECISION,
ADD COLUMN     "lat" DOUBLE PRECISION,
ADD COLUMN     "lng" DOUBLE PRECISION;
