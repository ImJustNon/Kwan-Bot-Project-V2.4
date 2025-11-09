import { EmbedBuilder, GuildMember } from "discord.js";
import { BotClient } from "../../../classes/Client.class";
import { Event } from "../classes/Event.class";
import { GuildLoggingChannel } from "../../../models/GuildLoggingChannel.model";
import { WebhookMessage } from "../../../utils/WebhookMessage.util";

export class GuildMemberAdd extends Event {
    constructor(client: BotClient) {
        super(client, "guildMemberAdd");
    }

    async callback(member: GuildMember): Promise<void> {
        if (!member.guild) return;

        const findLoggingSetup = await GuildLoggingChannel.findOne({
            guild_id: member.guild.id
        });
        if(!findLoggingSetup) return;
        if(!findLoggingSetup.events.includes(this.event)) return;

        const accountAge = Date.now() - member.user.createdTimestamp;
        const accountAgeDays = Math.floor(accountAge / (1000 * 60 * 60 * 24));

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${member.user.tag}`,
                iconURL: member.user.displayAvatarURL(),
            })
            .setTitle(`👋 Member Joined`)
            .setDescription(`${member.user} joined the server`)
            .addFields(
                { name: "Member", value: `${member.user}`, inline: true },
                { name: "Member ID", value: member.user.id, inline: true },
                { name: "Account Created", value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
                { name: "Account Age", value: `${accountAgeDays} days`, inline: true },
                { name: "Member Count", value: `${member.guild.memberCount}`, inline: true }
            )
            .setColor("Green")
            .setThumbnail(member.user.displayAvatarURL())
            .setFooter({ text: "Kwan's 💕 2" })
            .setTimestamp();

        await new WebhookMessage(findLoggingSetup.webhook_id, findLoggingSetup.webhook_token).send({ embeds: [embed] });
    }
}
