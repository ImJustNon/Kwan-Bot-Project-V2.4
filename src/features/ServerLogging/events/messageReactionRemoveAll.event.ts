import { EmbedBuilder, Message } from "discord.js";
import { BotClient } from "../../../classes/Client.class";
import { Event } from "../classes/Event.class";
import { GuildLoggingChannel } from "../../../models/GuildLoggingChannel.model";
import { WebhookMessage } from "../../../utils/WebhookMessage.util";

export class MessageReactionRemoveAll extends Event {
    constructor(client: BotClient) {
        super(client, "messageReactionRemoveAll");
    }

    async callback(message: Message): Promise<void> {
        if (!message.guild) return;

        const findLoggingSetup = await GuildLoggingChannel.findOne({
            guild_id: message.guildId
        });
        if(!findLoggingSetup) return;
        if(!findLoggingSetup.events.includes(this.event)) return;

        const embed = new EmbedBuilder()
            .setTitle(`🗑️ All Reactions Removed`)
            .setDescription(`All reactions were removed from a [message](${message.url})`)
            .addFields(
                { name: "Channel", value: `${message.channel}`, inline: true },
                { name: "Message ID", value: message.id, inline: true },
                { name: "Message Author", value: `${message.author}`, inline: true },
                { name: "Jump to Message", value: `[Click Here](${message.url})` }
            )
            .setColor("Red")
            .setFooter({ text: "Kwan's 💕 2" })
            .setTimestamp();

        if (message.content) {
            embed.addFields({ name: "Message Content", value: message.content.slice(0, 1024) });
        }

        await new WebhookMessage(findLoggingSetup.webhook_id, findLoggingSetup.webhook_token).send({ embeds: [embed] });
    }
}
