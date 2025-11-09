import { EmbedBuilder, Role } from "discord.js";
import { BotClient } from "../../../classes/Client.class";
import { Event } from "../classes/Event.class";
import { GuildLoggingChannel } from "../../../models/GuildLoggingChannel.model";
import { WebhookMessage } from "../../../utils/WebhookMessage.util";

export class RoleCreate extends Event {
    constructor(client: BotClient) {
        super(client, "roleCreate");
    }

    async callback(role: Role): Promise<void> {
        if (!role.guild) return;

        const findLoggingSetup = await GuildLoggingChannel.findOne({
            guild_id: role.guild.id
        });
        if(!findLoggingSetup) return;
        if(!findLoggingSetup.events.includes(this.event)) return;

        const permissions = role.permissions.toArray().join(", ") || "None";

        const embed = new EmbedBuilder()
            .setTitle(`➕ Role Created`)
            .setDescription(`Role ${role} was created`)
            .addFields(
                { name: "Role Name", value: role.name, inline: true },
                { name: "Role ID", value: role.id, inline: true },
                { name: "Color", value: role.hexColor, inline: true },
                { name: "Hoisted", value: role.hoist ? "Yes" : "No", inline: true },
                { name: "Mentionable", value: role.mentionable ? "Yes" : "No", inline: true },
                { name: "Position", value: `${role.position}`, inline: true },
                { name: "Permissions", value: permissions.slice(0, 1024) }
            )
            .setColor(role.color || "Blue")
            .setFooter({ text: "Kwan's 💕 2" })
            .setTimestamp();

        await new WebhookMessage(findLoggingSetup.webhook_id, findLoggingSetup.webhook_token).send({ embeds: [embed] });
    }
}
