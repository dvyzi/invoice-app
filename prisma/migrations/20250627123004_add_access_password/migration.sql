-- AlterTable
ALTER TABLE `Invoice` ADD COLUMN `accessPasswordHash` VARCHAR(191) NULL,
    MODIFY `status` ENUM('DRAFT', 'PENDING', 'PAID') NOT NULL DEFAULT 'DRAFT';
