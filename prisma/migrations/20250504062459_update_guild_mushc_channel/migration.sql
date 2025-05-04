/*
  Warnings:

  - The primary key for the `GuildMusicChannel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `author_id` on the `GuildMusicChannel` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `GuildMusicChannel` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[content_banner_id]` on the table `GuildMusicChannel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[content_queue_id]` on the table `GuildMusicChannel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[content_playing_id]` on the table `GuildMusicChannel` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `creator_user_id` to the `GuildMusicChannel` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "GuildMusicChannel_guild_id_key";

-- AlterTable
ALTER TABLE "GuildMusicChannel" DROP CONSTRAINT "GuildMusicChannel_pkey",
DROP COLUMN "author_id",
DROP COLUMN "id",
ADD COLUMN     "creator_user_id" TEXT NOT NULL,
ADD CONSTRAINT "GuildMusicChannel_pkey" PRIMARY KEY ("guild_id");

-- CreateIndex
CREATE UNIQUE INDEX "GuildMusicChannel_content_banner_id_key" ON "GuildMusicChannel"("content_banner_id");

-- CreateIndex
CREATE UNIQUE INDEX "GuildMusicChannel_content_queue_id_key" ON "GuildMusicChannel"("content_queue_id");

-- CreateIndex
CREATE UNIQUE INDEX "GuildMusicChannel_content_playing_id_key" ON "GuildMusicChannel"("content_playing_id");
