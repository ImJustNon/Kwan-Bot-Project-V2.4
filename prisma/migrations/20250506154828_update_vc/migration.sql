/*
  Warnings:

  - You are about to drop the column `author_id` on the `CacheAutoVoiceChannel` table. All the data in the column will be lost.
  - Added the required column `creator_user_id` to the `CacheAutoVoiceChannel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CacheAutoVoiceChannel" DROP COLUMN "author_id",
ADD COLUMN     "creator_user_id" TEXT NOT NULL;
