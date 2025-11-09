import { EmbedBuilder, Role } from "discord.js";
import { BotClient } from "../../../classes/Client.class";
import { Event } from "../classes/Event.class";
import { GuildLoggingChannel } from "../../../models/GuildLoggingChannel.model";
import { WebhookMessage } from "../../../utils/WebhookMessage.util";

export class RoleUpdate extends Event {
    constructor(client: BotClient) {
        super(client, "roleUpdate");
    }

    async callback(oldRole: Role, newRole: Role): Promise<void> {
        if (!newRole.guild) return;

        const findLoggingSetup = await GuildLoggingChannel.findOne({
            guild_id: newRole.guild.id
        });
        if(!findLoggingSetup) return;
        if(!findLoggingSetup.events.includes(this.event)) return;

        const changes: string[] = [];

        // Check name change
        if (oldRole.name !== newRole.name) {
            changes.push(`**Name:** ${oldRole.name} → ${newRole.name}`);
        }

        // Check color change
        if (oldRole.hexColor !== newRole.hexColor) {
            changes.push(`**Color:** ${oldRole.hexColor} → ${newRole.hexColor}`);
        }

        // Check hoist change
        if (oldRole.hoist !== newRole.hoist) {
            changes.push(`**Hoisted:** ${oldRole.hoist ? "Yes" : "No"} → ${newRole.hoist ? "Yes" : "No"}`);
        }

        // Check mentionable change
        if (oldRole.mentionable !== newRole.mentionable) {
            changes.push(`**Mentionable:** ${oldRole.mentionable ? "Yes" : "No"} → ${newRole.mentionable ? "Yes" : "No"}`);
        }

        // Check position change
        if (oldRole.position !== newRole.position) {
            changes.push(`**Position:** ${oldRole.position} → ${newRole.position}`);
        }

        // Check permissions change
        const addedPerms = newRole.permissions.toArray().filter(p => !oldRole.permissions.toArray().includes(p));
        const removedPerms = oldRole.permissions.toArray().filter(p => !newRole.permissions.toArray().includes(p));

        if (addedPerms.length > 0) {
            changes.push(`**Permissions Added:** ${addedPerms.join(", ")}`);
        }
        if (removedPerms.length > 0) {
            changes.push(`**Permissions Removed:** ${removedPerms.join(", ")}`);
        }

        if (changes.length === 0) return;

        const embed = new EmbedBuilder()
            .setTitle(`🔄 Role Updated`)
            .setDescription(`Role ${newRole} was updated\n\n${changes.join("\n")}`)
            .addFields(
                { name: "Role Name", value: newRole.name, inline: true },
                { name: "Role ID", value: newRole.id, inline: true }
            )
            .setColor(newRole.color || "Blue")
            .setFooter({ text: "Kwan's 💕 2" })
            .setTimestamp();

        await new WebhookMessage(findLoggingSetup.webhook_id, findLoggingSetup.webhook_token).send({ embeds: [embed] });
    }
}
