import { ChannelType, EmbedBuilder, GuildChannel } from "discord.js";
import { BotClient } from "../../../classes/Client.class";
import { Event } from "../classes/Event.class";
import { GuildLoggingChannel } from "../../../models/GuildLoggingChannel.model";
import { WebhookMessage } from "../../../utils/WebhookMessage.util";

export class ChannelDelete extends Event {
    constructor(client: BotClient) {
        super(client, "channelDelete");
    }

    async callback(channel: GuildChannel): Promise<void> {
        if (!channel.guild) return;

        const findLoggingSetup = await GuildLoggingChannel.findOne({
            guild_id: channel.guild.id
        });
        if(!findLoggingSetup) return;
        if(!findLoggingSetup.events.includes(this.event)) return;

        const channelTypes: Record<number, string> = {
            [ChannelType.GuildText]: "Text Channel",
            [ChannelType.GuildVoice]: "Voice Channel",
            [ChannelType.GuildCategory]: "Category",
            [ChannelType.GuildAnnouncement]: "Announcement Channel",
            [ChannelType.GuildStageVoice]: "Stage Channel",
            [ChannelType.GuildForum]: "Forum Channel",
        };

        const embed = new EmbedBuilder()
            .setTitle(`🗑️ Channel Deleted`)
            .setDescription(`Channel **${channel.name}** was deleted`)
            .addFields(
                { name: "Channel Name", value: channel.name, inline: true },
                { name: "Channel ID", value: channel.id, inline: true },
                { name: "Channel Type", value: channelTypes[channel.type] || "Unknown", inline: true },
                { name: "Position", value: `${channel.position}`, inline: true }
            )
            .setColor("Red")
            .setFooter({ text: "Kwan's 💕 2" })
            .setTimestamp();

        if (channel.parent) {
            embed.addFields({ name: "Category", value: channel.parent.name, inline: true });
        }

        await new WebhookMessage(findLoggingSetup.webhook_id, findLoggingSetup.webhook_token).send({ embeds: [embed] });
    }
}
