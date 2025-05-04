-- CreateTable
CREATE TABLE "GuildMusicChannel" (
    "id" SERIAL NOT NULL,
    "guild_id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "content_banner_id" TEXT NOT NULL,
    "content_queue_id" TEXT NOT NULL,
    "content_playing_id" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuildMusicChannel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GuildMusicChannel_guild_id_key" ON "GuildMusicChannel"("guild_id");

-- CreateIndex
CREATE UNIQUE INDEX "GuildMusicChannel_channel_id_key" ON "GuildMusicChannel"("channel_id");
