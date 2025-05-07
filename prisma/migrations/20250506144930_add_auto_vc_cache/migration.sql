-- CreateTable
CREATE TABLE "CacheAutoVoiceChannel" (
    "guild_id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "parent_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CacheAutoVoiceChannel_pkey" PRIMARY KEY ("channel_id")
);
