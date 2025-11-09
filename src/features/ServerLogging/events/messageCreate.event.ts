import { EmbedBuilder, Message, TextChannel, User } from "discord.js";
import { BotClient } from "../../../classes/Client.class";
import { Event } from "../classes/Event.class";
import { GuildLoggingChannel } from "../../../models/GuildLoggingChannel.model";
import { WebhookMessage } from "../../../utils/WebhookMessage.util";

export class MessageCreate extends Event {
    constructor(client: BotClient) {
        super(client, "messageCreate");
    }

    async callback(message: Message): Promise<void> {
        if (message.author.bot || !message.guild) return;

        const findLoggingSetup = await GuildLoggingChannel.findOne({
            guild_id: message.guildId
        });
        if(!findLoggingSetup) return;


        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${message.author.tag}`,
                iconURL: message.author.displayAvatarURL(),
            })
            .setTitle(`📝 Message Created`)
            .setDescription(message.content || "*No text content*")
            .addFields(
                { name: "Channel", value: `${message.channel}`, inline: true },
                { name: "Message ID", value: `${message.id}`, inline: true },
                { name: "Member ID", value: message.author.id, inline: true }
            )
            .setColor("Blue")
            .setFooter({ text: "Kwan's 💕 2" })
            .setTimestamp();

        if (message.attachments.size > 0) {
            const attachmentUrls = message.attachments.map(a => a.url).join("\n");
            embed.addFields({
                name: "Attachments",
                value: attachmentUrls.slice(0, 1024) || "Too many attachments to display",
            });
        }

        await new WebhookMessage(findLoggingSetup.webhook_id, findLoggingSetup.webhook_token).send({ embeds: [embed] });
    }
}