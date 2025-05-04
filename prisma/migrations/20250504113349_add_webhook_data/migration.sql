/*
  Warnings:

  - A unique constraint covering the columns `[webhook_id]` on the table `GuildMusicChannel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[webhook_token]` on the table `GuildMusicChannel` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `webhook_id` to the `GuildMusicChannel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `webhook_token` to the `GuildMusicChannel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GuildMusicChannel" ADD COLUMN     "webhook_id" TEXT NOT NULL,
ADD COLUMN     "webhook_token" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "GuildMusicChannel_webhook_id_key" ON "GuildMusicChannel"("webhook_id");

-- CreateIndex
CREATE UNIQUE INDEX "GuildMusicChannel_webhook_token_key" ON "GuildMusicChannel"("webhook_token");
