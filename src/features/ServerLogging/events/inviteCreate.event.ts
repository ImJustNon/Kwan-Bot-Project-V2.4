import { EmbedBuilder, Invite } from "discord.js";
import { BotClient } from "../../../classes/Client.class";
import { Event } from "../classes/Event.class";
import { GuildLoggingChannel } from "../../../models/GuildLoggingChannel.model";
import { WebhookMessage } from "../../../utils/WebhookMessage.util";

export class InviteCreate extends Event {
    constructor(client: BotClient) {
        super(client, "inviteCreate");
    }

    async callback(invite: Invite): Promise<void> {
        if (!invite.guild) return;

        const findLoggingSetup = await GuildLoggingChannel.findOne({
            guild_id: invite.guild.id
        });
        if(!findLoggingSetup) return;
        if(!findLoggingSetup.events.includes(this.event)) return;

        const inviter = invite.inviter;
        const maxAge = !invite.maxAge || invite.maxAge === 0 ? "Never" : `<t:${Math.floor((Date.now() + invite.maxAge * 1000) / 1000)}:R>`;
        const maxUses = invite.maxUses === 0 ? "Unlimited" : `${invite.maxUses}`;

        const embed = new EmbedBuilder()
            .setTitle(`📨 Invite Created`)
            .setDescription(`An invite was created for ${invite.channel}`)
            .addFields(
                { name: "Invite Code", value: invite.code, inline: true },
                { name: "Channel", value: `${invite.channel}`, inline: true },
                { name: "Created By", value: inviter ? `${inviter}` : "Unknown", inline: true },
                { name: "Expires", value: maxAge, inline: true },
                { name: "Max Uses", value: maxUses, inline: true },
                { name: "Temporary Membership", value: invite.temporary ? "Yes" : "No", inline: true },
                { name: "Invite URL", value: `https://discord.gg/${invite.code}` }
            )
            .setColor("Blue")
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
