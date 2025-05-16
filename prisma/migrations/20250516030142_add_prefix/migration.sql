/*
  Warnings:

  - Added the required column `prefix` to the `GuildServerStats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GuildServerStats" ADD COLUMN     "prefix" TEXT NOT NULL;
