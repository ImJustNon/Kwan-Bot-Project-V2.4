-- CreateTable
CREATE TABLE "GuildAutoVoiceChannel" (
    "guild_id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "creator_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuildAutoVoiceChannel_pkey" PRIMARY KEY ("channel_id")
);
