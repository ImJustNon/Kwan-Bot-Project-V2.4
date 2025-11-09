import { EmbedBuilder, Message, TextChannel, User } from "discord.js";
import { BotClient } from "../../../classes/Client.class";
import { Event } from "../classes/Event.class";
import { GuildLoggingChannel } from "../../../models/GuildLoggingChannel.model";
import { WebhookMessage } from "../../../utils/WebhookMessage.util";

export class MessageDelete extends Event {
    constructor(client: BotClient) {
        super(client, "messageDelete");
    }

    async callback(message: Message): Promise<void> {
        if (!message.author || message.author.bot || !message.guild) return;

        const findLoggingSetup = await GuildLoggingChannel.findOne({
            guild_id: message.guildId
        });
        if(!findLoggingSetup) return;
        if(!findLoggingSetup.events.includes(this.event)) return;

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${message.author.tag}`,
                iconURL: message.author.displayAvatarURL(),
            })
            .setTitle(`🗑️ Message Deleted`)
            .setDescription(message.content || "*No text content*")
            .addFields(
                { name: "Channel", value: `${message.channel}`, inline: true },
                { name: "Message ID", value: `${message.id}`, inline: true },
                { name: "Member ID", value: message.author.id, inline: true }
            )
            .setColor("Red")
            .setThumbnail(message.author.displayAvatarURL())
            .setFooter({ text: "Kwan's 💕 2" })
            .setTimestamp();

        if (message.content && message.content.length > 0) {
            embed.setDescription(message.content.slice(0, 2048));
        }

        if (message.attachments.size > 0) {
            const attachmentUrls = message.attachments.map(a => a.url).join("\n");
            embed.addFields({
                name: "Attachments",
                value: attachmentUrls.slice(0, 1024) || "Too many attachments to display",
            });
        }

        if (message.stickers.size > 0) {
            const stickerNames = message.stickers.map(s => s.name).join(", ");
            embed.addFields({
                name: "Stickers",
                value: stickerNames.slice(0, 1024),
            });
        }

        await new WebhookMessage(findLoggingSetup.webhook_id, findLoggingSetup.webhook_token).send({ embeds: [embed] });
    }
}