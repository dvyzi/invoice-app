/*
  Warnings:

  - You are about to drop the column `adress` on the `Invoice` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `Invoice` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `Enum(EnumId(0))`.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductInvoice` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `address` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentTerms` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_ProductInvoice` DROP FOREIGN KEY `_ProductInvoice_A_fkey`;

-- DropForeignKey
ALTER TABLE `_ProductInvoice` DROP FOREIGN KEY `_ProductInvoice_B_fkey`;

-- AlterTable
ALTER TABLE `Invoice` DROP COLUMN `adress`,
    ADD COLUMN `address` VARCHAR(255) NOT NULL,
    ADD COLUMN `paymentTerms` INTEGER NOT NULL,
    ADD COLUMN `total` DOUBLE NULL,
    MODIFY `status` ENUM('DRAFT', 'PENDING', 'PAID') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `User` ADD COLUMN `address` VARCHAR(255) NULL,
    ADD COLUMN `city` VARCHAR(100) NULL,
    ADD COLUMN `country` VARCHAR(100) NULL,
    ADD COLUMN `postalCode` VARCHAR(20) NULL;

-- DropTable
DROP TABLE `Product`;

-- DropTable
DROP TABLE `_ProductInvoice`;

-- CreateTable
CREATE TABLE `InvoiceItem` (
    `id` VARCHAR(191) NOT NULL,
    `invoiceId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `total` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `InvoiceItem` ADD CONSTRAINT `InvoiceItem_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
