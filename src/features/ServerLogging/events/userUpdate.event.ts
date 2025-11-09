import { EmbedBuilder, User } from "discord.js";
import { BotClient } from "../../../classes/Client.class";
import { Event } from "../classes/Event.class";
import { GuildLoggingChannel } from "../../../models/GuildLoggingChannel.model";
import { WebhookMessage } from "../../../utils/WebhookMessage.util";

export class UserUpdate extends Event {
    constructor(client: BotClient) {
        super(client, "userUpdate");
    }

    async callback(oldUser: User, newUser: User): Promise<void> {
        const changes: string[] = [];

        // Check username change
        if (oldUser.username !== newUser.username) {
            changes.push(`**Username:** ${oldUser.username} → ${newUser.username}`);
        }

        // Check discriminator change (for legacy accounts)
        if (oldUser.discriminator !== newUser.discriminator) {
            changes.push(`**Discriminator:** ${oldUser.discriminator} → ${newUser.discriminator}`);
        }

        // Check avatar change
        if (oldUser.avatar !== newUser.avatar) {
            changes.push(`**Avatar:** Changed`);
        }

        if (changes.length === 0) return;

        // Find all guilds where this user is a member
        const guilds = this.client.guilds.cache.filter((guild) => guild.members.cache.has(newUser.id));

        for (const guild of guilds.values()) {
            const findLoggingSetup = await GuildLoggingChannel.findOne({
                guild_id: guild.id
            });
            if(!findLoggingSetup) continue;
            if(!findLoggingSetup.events.includes(this.event)) continue;

            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `${newUser.tag}`,
                    iconURL: newUser.displayAvatarURL(),
                })
                .setTitle(`👤 User Updated`)
                .setDescription(changes.join("\n"))
                .addFields(
                    { name: "User", value: `${newUser}`, inline: true },
                    { name: "User ID", value: newUser.id, inline: true }
                )
                .setColor("Purple")
                .setThumbnail(newUser.displayAvatarURL())
                .setFooter({ text: "Kwan's 💕 2" })
                .setTimestamp();

            if (oldUser.avatar !== newUser.avatar) {
                embed.setImage(newUser.displayAvatarURL({ size: 256 }));
            }

            await new WebhookMessage(findLoggingSetup.webhook_id, findLoggingSetup.webhook_token).send({ embeds: [embed] });
        }
    }
}
