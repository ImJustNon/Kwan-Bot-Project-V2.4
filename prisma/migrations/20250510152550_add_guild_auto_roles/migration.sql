-- CreateTable
CREATE TABLE "GuildAutoRoles" (
    "guild_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "creator_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuildAutoRoles_pkey" PRIMARY KEY ("role_id")
);
