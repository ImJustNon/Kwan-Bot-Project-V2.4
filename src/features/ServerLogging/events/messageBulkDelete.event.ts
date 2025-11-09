import { Collection, EmbedBuilder, Message, Snowflake } from "discord.js";
import { BotClient } from "../../../classes/Client.class";
import { Event } from "../classes/Event.class";
import { GuildLoggingChannel } from "../../../models/GuildLoggingChannel.model";
import { WebhookMessage } from "../../../utils/WebhookMessage.util";

export class MessageBulkDelete extends Event {
    constructor(client: BotClient) {
        super(client, "messageDeleteBulk");
    }

    async callback(messages: Collection<Snowflake, Message>): Promise<void> {
        const firstMessage = messages.first();
        if (!firstMessage || !firstMessage.guild) return;

        const findLoggingSetup = await GuildLoggingChannel.findOne({
            guild_id: firstMessage.guildId
        });
        if(!findLoggingSetup) return;
        if(!findLoggingSetup.events.includes(this.event)) return;

        const messageList = messages
            .map(msg => `**${msg.author?.tag || "Unknown"}**: ${msg.content || "*No content*"}`)
            .slice(0, 10)
            .join("\n");

        const embed = new EmbedBuilder()
            .setTitle(`🗑️ Bulk Message Delete`)
            .setDescription(`**${messages.size}** messages were deleted`)
            .addFields(
                { name: "Channel", value: `${firstMessage.channel}`, inline: true },
                { name: "Messages Deleted", value: `${messages.size}`, inline: true },
                { name: "Sample Messages", value: messageList || "*No messages to display*" }
            )
            .setColor("Red")
            .setFooter({ text: "Kwan's 💕 2" })
            .setTimestamp();

        await new WebhookMessage(findLoggingSetup.webhook_id, findLoggingSetup.webhook_token).send({ embeds: [embed] });
    }
}
