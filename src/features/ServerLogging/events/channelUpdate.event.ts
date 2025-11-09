import { ChannelType, EmbedBuilder, GuildChannel } from "discord.js";
import { BotClient } from "../../../classes/Client.class";
import { Event } from "../classes/Event.class";
import { GuildLoggingChannel } from "../../../models/GuildLoggingChannel.model";
import { WebhookMessage } from "../../../utils/WebhookMessage.util";

export class ChannelUpdate extends Event {
    constructor(client: BotClient) {
        super(client, "channelUpdate");
    }

    async callback(oldChannel: GuildChannel, newChannel: GuildChannel): Promise<void> {
        if (!newChannel.guild) return;

        const findLoggingSetup = await GuildLoggingChannel.findOne({
            guild_id: newChannel.guild.id
        });
        if(!findLoggingSetup) return;
        if(!findLoggingSetup.events.includes(this.event)) return;

        const changes: string[] = [];

        // Check name change
        if (oldChannel.name !== newChannel.name) {
            changes.push(`**Name:** ${oldChannel.name} → ${newChannel.name}`);
        }

        // Check position change
        if (oldChannel.position !== newChannel.position) {
            changes.push(`**Position:** ${oldChannel.position} → ${newChannel.position}`);
        }

        // Check parent (category) change
        if (oldChannel.parentId !== newChannel.parentId) {
            changes.push(`**Category:** ${oldChannel.parent?.name || "None"} → ${newChannel.parent?.name || "None"}`);
        }

        // Check permission overwrites
        const oldPerms = oldChannel.permissionOverwrites.cache.size;
        const newPerms = newChannel.permissionOverwrites.cache.size;
        if (oldPerms !== newPerms) {
            changes.push(`**Permission Overwrites:** ${oldPerms} → ${newPerms}`);
        }

        if (changes.length === 0) return;

        const channelTypes: Record<number, string> = {
            [ChannelType.GuildText]: "Text Channel",
            [ChannelType.GuildVoice]: "Voice Channel",
            [ChannelType.GuildCategory]: "Category",
            [ChannelType.GuildAnnouncement]: "Announcement Channel",
            [ChannelType.GuildStageVoice]: "Stage Channel",
            [ChannelType.GuildForum]: "Forum Channel",
        };

        const embed = new EmbedBuilder()
            .setTitle(`🔄 Channel Updated`)
            .setDescription(`Channel ${newChannel} was updated\n\n${changes.join("\n")}`)
            .addFields(
                { name: "Channel Name", value: newChannel.name, inline: true },
                { name: "Channel ID", value: newChannel.id, inline: true },
                { name: "Channel Type", value: channelTypes[newChannel.type] || "Unknown", inline: true }
            )
            .setColor("Blue")
            .setFooter({ text: "Kwan's 💕 2" })
            .setTimestamp();

        await new WebhookMessage(findLoggingSetup.webhook_id, findLoggingSetup.webhook_token).send({ embeds: [embed] });
    }
}
