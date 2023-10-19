/*
  Warnings:

  - Added the required column `picture` to the `picture` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `picture` ADD COLUMN `picture` VARCHAR(191) NOT NULL;
