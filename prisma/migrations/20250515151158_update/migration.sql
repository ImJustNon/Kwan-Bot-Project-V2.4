/*
  Warnings:

  - The primary key for the `GuildServerStats` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bots_channel_id` on the `GuildServerStats` table. All the data in the column will be lost.
  - You are about to drop the column `members_channel_id` on the `GuildServerStats` table. All the data in the column will be lost.
  - You are about to drop the column `users_channel_id` on the `GuildServerStats` table. All the data in the column will be lost.
  - Added the required column `channel_id` to the `GuildServerStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `channel_name` to the `GuildServerStats` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "GuildServerStats_bots_channel_id_key";

-- DropIndex
DROP INDEX "GuildServerStats_members_channel_id_key";

-- DropIndex
DROP INDEX "GuildServerStats_parent_id_key";

-- DropIndex
DROP INDEX "GuildServerStats_users_channel_id_key";

-- AlterTable
ALTER TABLE "GuildServerStats" DROP CONSTRAINT "GuildServerStats_pkey",
DROP COLUMN "bots_channel_id",
DROP COLUMN "members_channel_id",
DROP COLUMN "users_channel_id",
ADD COLUMN     "channel_id" TEXT NOT NULL,
ADD COLUMN     "channel_name" TEXT NOT NULL,
ADD CONSTRAINT "GuildServerStats_pkey" PRIMARY KEY ("channel_id");
