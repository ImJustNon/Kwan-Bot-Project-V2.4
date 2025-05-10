-- CreateTable
CREATE TABLE "GuildDisabledCommand" (
    "unique_id" SERIAL NOT NULL,
    "guild_id" TEXT NOT NULL,
    "command_name" TEXT NOT NULL,
    "creator_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuildDisabledCommand_pkey" PRIMARY KEY ("unique_id")
);
