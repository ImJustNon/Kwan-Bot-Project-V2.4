import { EmbedBuilder, MessageReaction, User } from "discord.js";
import { BotClient } from "../../../classes/Client.class";
import { Event } from "../classes/Event.class";
import { GuildLoggingChannel } from "../../../models/GuildLoggingChannel.model";
import { WebhookMessage } from "../../../utils/WebhookMessage.util";

export class MessageReactionRemove extends Event {
    constructor(client: BotClient) {
        super(client, "messageReactionRemove");
    }

    async callback(reaction: MessageReaction, user: User): Promise<void> {
        if (user.bot) return;
        
        // Fetch the message if it's partial
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                return;
            }
        }

        const message = reaction.message;
        if (!message.guild) return;

        const findLoggingSetup = await GuildLoggingChannel.findOne({
            guild_id: message.guildId
        });
        if(!findLoggingSetup) return;
        if(!findLoggingSetup.events.includes(this.event)) return;

        const emoji = reaction.emoji.id 
            ? `<:${reaction.emoji.name}:${reaction.emoji.id}>` 
            : reaction.emoji.name;

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${user.tag}`,
                iconURL: user.displayAvatarURL(),
            })
            .setTitle(`➖ Reaction Removed`)
            .setDescription(`${user} removed ${emoji} from a [message](${message.url})`)
            .addFields(
                { name: "Channel", value: `${message.channel}`, inline: true },
                { name: "Message ID", value: message.id, inline: true },
                { name: "Emoji", value: `${emoji}`, inline: true },
                { name: "Message Author", value: `${message.author}`, inline: true },
                { name: "Jump to Message", value: `[Click Here](${message.url})` }
            )
            .setColor("Red")
            .setFooter({ text: "Kwan's 💕 2" })
            .setTimestamp();

        await new WebhookMessage(findLoggingSetup.webhook_id, findLoggingSetup.webhook_token).send({ embeds: [embed] });
    }
}
