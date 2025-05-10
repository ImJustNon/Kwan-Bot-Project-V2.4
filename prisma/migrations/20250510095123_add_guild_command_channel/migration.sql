-- CreateTable
CREATE TABLE "GuildCommandChannel" (
    "guild_id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "creator_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuildCommandChannel_pkey" PRIMARY KEY ("guild_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GuildCommandChannel_channel_id_key" ON "GuildCommandChannel"("channel_id");
