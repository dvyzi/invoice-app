-- AlterTable
ALTER TABLE `Invoice` ADD COLUMN `isSigned` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `signature` LONGTEXT NULL,
    ADD COLUMN `signatureDate` DATETIME(3) NULL;
