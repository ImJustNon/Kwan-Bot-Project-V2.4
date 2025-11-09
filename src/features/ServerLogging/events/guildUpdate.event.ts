import { EmbedBuilder, Guild } from "discord.js";
import { BotClient } from "../../../classes/Client.class";
import { Event } from "../classes/Event.class";
import { GuildLoggingChannel } from "../../../models/GuildLoggingChannel.model";
import { WebhookMessage } from "../../../utils/WebhookMessage.util";

export class GuildUpdate extends Event {
    constructor(client: BotClient) {
        super(client, "guildUpdate");
    }

    async callback(oldGuild: Guild, newGuild: Guild): Promise<void> {
        const findLoggingSetup = await GuildLoggingChannel.findOne({
            guild_id: newGuild.id
        });
        if(!findLoggingSetup) return;
        if(!findLoggingSetup.events.includes(this.event)) return;

        const changes: string[] = [];

        // Check name change
        if (oldGuild.name !== newGuild.name) {
            changes.push(`**Name:** ${oldGuild.name} → ${newGuild.name}`);
        }

        // Check icon change
        if (oldGuild.icon !== newGuild.icon) {
            changes.push(`**Icon:** Changed`);
        }

        // Check banner change
        if (oldGuild.banner !== newGuild.banner) {
            changes.push(`**Banner:** Changed`);
        }

        // Check description change
        if (oldGuild.description !== newGuild.description) {
            changes.push(`**Description:** ${oldGuild.description || "None"} → ${newGuild.description || "None"}`);
        }

        // Check verification level change
        if (oldGuild.verificationLevel !== newGuild.verificationLevel) {
            changes.push(`**Verification Level:** ${oldGuild.verificationLevel} → ${newGuild.verificationLevel}`);
        }

        // Check owner change
        if (oldGuild.ownerId !== newGuild.ownerId) {
            changes.push(`**Owner:** <@${oldGuild.ownerId}> → <@${newGuild.ownerId}>`);
        }

        if (changes.length === 0) return;

        const embed = new EmbedBuilder()
            .setTitle(`🏰 Server Updated`)
            .setDescription(changes.join("\n"))
            .addFields(
                { name: "Server Name", value: newGuild.name, inline: true },
                { name: "Server ID", value: newGuild.id, inline: true }
            )
            .setColor("Blue")
            .setThumbnail(newGuild.iconURL() || "")
            .setFooter({ text: "Kwan's 💕 2" })
            .setTimestamp();

        if (oldGuild.icon !== newGuild.icon && newGuild.iconURL()) {
            embed.setImage(newGuild.iconURL({ size: 256 }) || "");
        }

        await new WebhookMessage(findLoggingSetup.webhook_id, findLoggingSetup.webhook_token).send({ embeds: [embed] });
    }
}
