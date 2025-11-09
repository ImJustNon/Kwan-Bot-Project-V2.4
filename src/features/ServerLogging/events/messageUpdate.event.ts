import { EmbedBuilder, Message, TextChannel, User } from "discord.js";
import { BotClient } from "../../../classes/Client.class";
import { Event } from "../classes/Event.class";
import { GuildLoggingChannel } from "../../../models/GuildLoggingChannel.model";
import { WebhookMessage } from "../../../utils/WebhookMessage.util";

export class MessageUpdate extends Event {
    constructor(client: BotClient) {
        super(client, "messageUpdate");
    }

    async callback(oldMessage: Message, newMessage: Message): Promise<void> {
        if (!newMessage.author || newMessage.author.bot || !newMessage.guild) return;
        if (oldMessage.content === newMessage.content) return;

        const findLoggingSetup = await GuildLoggingChannel.findOne({
            guild_id: newMessage.guildId
        });
        if(!findLoggingSetup) return;
        if(!findLoggingSetup.events.includes(this.event)) return;

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${newMessage.author.tag}`,
                iconURL: newMessage.author.displayAvatarURL(),
            })
            .setTitle(`✏️ Message Updated`)
            .addFields(
                { name: "Before", value: oldMessage.content || "*No text content*" },
                { name: "After", value: newMessage.content || "*No text content*" },
                { name: "Channel", value: `${newMessage.channel}`, inline: true },
                { name: "Message ID", value: `${newMessage.id}`, inline: true },
                { name: "Member ID", value: newMessage.author.id, inline: true },
                { name: "Jump to Message", value: `[Click Here](${newMessage.url})` }
            )
            .setColor("Yellow")
            .setFooter({ text: "Kwan's 💕 2" })
            .setTimestamp();

        await new WebhookMessage(findLoggingSetup.webhook_id, findLoggingSetup.webhook_token).send({ embeds: [embed] });
    }
}
