import { EmbedBuilder, GuildBan } from "discord.js";
import { BotClient } from "../../../classes/Client.class";
import { Event } from "../classes/Event.class";
import { GuildLoggingChannel } from "../../../models/GuildLoggingChannel.model";
import { WebhookMessage } from "../../../utils/WebhookMessage.util";

export class GuildBanAdd extends Event {
    constructor(client: BotClient) {
        super(client, "guildBanAdd");
    }

    async callback(ban: GuildBan): Promise<void> {
        if (!ban.guild) return;

        const findLoggingSetup = await GuildLoggingChannel.findOne({
            guild_id: ban.guild.id
        });
        if(!findLoggingSetup) return;
        if(!findLoggingSetup.events.includes(this.event)) return;

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${ban.user.tag}`,
                iconURL: ban.user.displayAvatarURL(),
            })
            .setTitle(`🔨 Member Banned`)
            .setDescription(`${ban.user} was banned from the server`)
            .addFields(
                { name: "User", value: `${ban.user}`, inline: true },
                { name: "User ID", value: ban.user.id, inline: true },
                { name: "Reason", value: ban.reason || "No reason provided" }
            )
            .setColor("Red")
            .setThumbnail(ban.user.displayAvatarURL())
            .setFooter({ text: "Kwan's 💕 2" })
            .setTimestamp();

        await new WebhookMessage(findLoggingSetup.webhook_id, findLoggingSetup.webhook_token).send({ embeds: [embed] });
    }
}
