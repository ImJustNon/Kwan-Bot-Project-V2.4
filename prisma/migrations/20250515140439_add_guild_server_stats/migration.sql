-- CreateTable
CREATE TABLE "GuildServerStats" (
    "guild_id" TEXT NOT NULL,
    "members_channel_id" TEXT NOT NULL,
    "users_channel_id" TEXT NOT NULL,
    "bots_channel_id" TEXT NOT NULL,
    "parent_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuildServerStats_pkey" PRIMARY KEY ("guild_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GuildServerStats_members_channel_id_key" ON "GuildServerStats"("members_channel_id");

-- CreateIndex
CREATE UNIQUE INDEX "GuildServerStats_users_channel_id_key" ON "GuildServerStats"("users_channel_id");

-- CreateIndex
CREATE UNIQUE INDEX "GuildServerStats_bots_channel_id_key" ON "GuildServerStats"("bots_channel_id");

-- CreateIndex
CREATE UNIQUE INDEX "GuildServerStats_parent_id_key" ON "GuildServerStats"("parent_id");
