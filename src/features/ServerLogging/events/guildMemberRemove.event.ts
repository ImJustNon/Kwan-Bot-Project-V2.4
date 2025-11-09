import { EmbedBuilder, GuildMember } from "discord.js";
import { BotClient } from "../../../classes/Client.class";
import { Event } from "../classes/Event.class";
import { GuildLoggingChannel } from "../../../models/GuildLoggingChannel.model";
import { WebhookMessage } from "../../../utils/WebhookMessage.util";

export class GuildMemberRemove extends Event {
    constructor(client: BotClient) {
        super(client, "guildMemberRemove");
    }

    async callback(member: GuildMember): Promise<void> {
        if (!member.guild) return;

        const findLoggingSetup = await GuildLoggingChannel.findOne({
            guild_id: member.guild.id
        });
        if(!findLoggingSetup) return;
        if(!findLoggingSetup.events.includes(this.event)) return;

        const roles = member.roles.cache
            .filter(role => role.id !== member.guild.id)
            .map(role => role.toString())
            .join(", ") || "No roles";

        const joinedAt = member.joinedTimestamp 
            ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` 
            : "Unknown";

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${member.user.tag}`,
                iconURL: member.user.displayAvatarURL(),
            })
            .setTitle(`👋 Member Left`)
            .setDescription(`${member.user} left the server`)
            .addFields(
                { name: "Member", value: `${member.user}`, inline: true },
                { name: "Member ID", value: member.user.id, inline: true },
                { name: "Joined At", value: joinedAt, inline: true },
                { name: "Roles", value: roles.slice(0, 1024) },
                { name: "Member Count", value: `${member.guild.memberCount}`, inline: true }
            )
            .setColor("Red")
            .setThumbnail(member.user.displayAvatarURL())
            .setFooter({ text: "Kwan's 💕 2" })
            .setTimestamp();

        await new WebhookMessage(findLoggingSetup.webhook_id, findLoggingSetup.webhook_token).send({ embeds: [embed] });
    }
}
