/*
  Warnings:

  - Added the required column `comprobante` to the `Pedido` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pedido` ADD COLUMN `comprobante` VARCHAR(191) NOT NULL;
