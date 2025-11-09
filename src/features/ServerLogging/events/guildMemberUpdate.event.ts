import { EmbedBuilder, GuildMember } from "discord.js";
import { BotClient } from "../../../classes/Client.class";
import { Event } from "../classes/Event.class";
import { GuildLoggingChannel } from "../../../models/GuildLoggingChannel.model";
import { WebhookMessage } from "../../../utils/WebhookMessage.util";

export class GuildMemberUpdate extends Event {
    constructor(client: BotClient) {
        super(client, "guildMemberUpdate");
    }

    async callback(oldMember: GuildMember, newMember: GuildMember): Promise<void> {
        if (!newMember.guild) return;

        const findLoggingSetup = await GuildLoggingChannel.findOne({
            guild_id: newMember.guild.id
        });
        if(!findLoggingSetup) return;
        if(!findLoggingSetup.events.includes(this.event)) return;

        const changes: string[] = [];

        // Check nickname change
        if (oldMember.nickname !== newMember.nickname) {
            changes.push(`**Nickname:** ${oldMember.nickname || "None"} → ${newMember.nickname || "None"}`);
        }

        // Check role changes
        const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
        const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));

        if (addedRoles.size > 0) {
            changes.push(`**Roles Added:** ${addedRoles.map(r => r.toString()).join(", ")}`);
        }
        if (removedRoles.size > 0) {
            changes.push(`**Roles Removed:** ${removedRoles.map(r => r.toString()).join(", ")}`);
        }

        // Check timeout changes
        if (oldMember.communicationDisabledUntilTimestamp !== newMember.communicationDisabledUntilTimestamp) {
            if (newMember.communicationDisabledUntilTimestamp) {
                changes.push(`**Timed Out Until:** <t:${Math.floor(newMember.communicationDisabledUntilTimestamp / 1000)}:F>`);
            } else {
                changes.push(`**Timeout Removed**`);
            }
        }

        if (changes.length === 0) return;

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${newMember.user.tag}`,
                iconURL: newMember.user.displayAvatarURL(),
            })
            .setTitle(`🔄 Member Updated`)
            .setDescription(changes.join("\n"))
            .addFields(
                { name: "Member", value: `${newMember.user}`, inline: true },
                { name: "Member ID", value: newMember.user.id, inline: true }
            )
            .setColor("Blue")
            .setThumbnail(newMember.user.displayAvatarURL())
            .setFooter({ text: "Kwan's 💕 2" })
            .setTimestamp();

        await new WebhookMessage(findLoggingSetup.webhook_id, findLoggingSetup.webhook_token).send({ embeds: [embed] });
    }
}
