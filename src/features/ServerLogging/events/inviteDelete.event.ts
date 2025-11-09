import { EmbedBuilder, Invite } from "discord.js";
import { BotClient } from "../../../classes/Client.class";
import { Event } from "../classes/Event.class";
import { GuildLoggingChannel } from "../../../models/GuildLoggingChannel.model";
import { WebhookMessage } from "../../../utils/WebhookMessage.util";

export class InviteDelete extends Event {
    constructor(client: BotClient) {
        super(client, "inviteDelete");
    }

    async callback(invite: Invite): Promise<void> {
        if (!invite.guild) return;

        const findLoggingSetup = await GuildLoggingChannel.findOne({
            guild_id: invite.guild.id
        });
        if(!findLoggingSetup) return;
        if(!findLoggingSetup.events.includes(this.event)) return;

        const inviter = invite.inviter;

        const embed = new EmbedBuilder()
            .setTitle(`🗑️ Invite Deleted`)
            .setDescription(`An invite was deleted for ${invite.channel}`)
            .addFields(
                { name: "Invite Code", value: invite.code, inline: true },
                { name: "Channel", value: `${invite.channel}`, inline: true },
                { name: "Created By", value: inviter ? `${inviter}` : "Unknown", inline: true },
                { name: "Uses", value: `${invite.uses || 0}`, inline: true }
            )
            .setColor("Red")
            .setFooter({ text: "Kwan's 💕 2" })
            .setTimestamp();

        if (inviter) {
            embed.setAuthor({
                name: `${inviter.tag}`,
                iconURL: inviter.displayAvatarURL(),
            });
        }

        await new WebhookMessage(findLoggingSetup.webhook_id, findLoggingSetup.webhook_token).send({ embeds: [embed] });
    }
}
